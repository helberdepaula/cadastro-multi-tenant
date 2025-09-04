import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthService } from "@/service/auth.service";
import { payloadAuth, UserProfile, AuthResponse } from "@/types/auth";
import Cookies from 'js-cookie';
//Jwt Decoder 
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  decodedToken: any | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  setToken: (token: string) => void;
  setAuthData: (authResponse: AuthResponse) => void;
  login: (payloadAuth: payloadAuth) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      decodedToken: null,
      isAuthenticated: false,

      setUser: (user: UserProfile) => {
        set({ user });
      },

      setToken: (token: string) => {
        const decodedToken = decodeJWT(token);
        set({
          token,
          decodedToken,
          isAuthenticated: !!token
        });

        Cookies.set('token', token, {
          expires: 7, // 7 dias
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        Cookies.set('tcn', 'authenticated', {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      },

      setAuthData: (authResponse: AuthResponse) => {
        const { access_token, refresh_token } = authResponse;
        const decodedToken = decodeJWT(access_token);
        console.log(decodedToken)
        const user: UserProfile = {
          id: decodedToken?.sub || decodedToken?.id || '',
          tenantId: decodedToken?.tenantId || decodedToken?.tenantId || '',
          email: decodedToken?.email || '',
          name: decodedToken?.name || decodedToken?.username || '',
          role: decodedToken?.role || decodedToken?.roles?.[0] || ''
        };

        set({
          token: access_token,
          refreshToken: refresh_token,
          user,
          decodedToken,
          isAuthenticated: true
        });


        Cookies.set('token', access_token, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        Cookies.set('tcn', 'authenticated', {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        const sessionName = process.env.NEXT_PUBLIC_SESSION_NAME || 'avalidacao';
        localStorage.setItem(`token_${sessionName}`, JSON.stringify(authResponse));
      },

      login: async (payloadAuth: payloadAuth) => {
        try {
          const authResponse = await AuthService.login(payloadAuth);
          get().setAuthData(authResponse);
        } catch (error) {
          console.error('Erro no login:', error);
          throw error;
        }
      },

      logout: async () => {
        set({
          token: null,
          refreshToken: null,
          user: null,
          decodedToken: null,
          isAuthenticated: false
        });


        Cookies.remove('token');
        Cookies.remove('tcn');

        const sessionName = process.env.NEXT_PUBLIC_SESSION_NAME || 'avalidacao';
        localStorage.removeItem(`token_${sessionName}`);
      },

      refreshAuthToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('Refresh token não encontrado');
          }

          const authResponse = await AuthService.refresh({ refreshToken });
          get().setAuthData(authResponse);
        } catch (error) {
          console.error('Erro ao renovar token:', error);
          get().logout();
          throw error;
        }
      },

      initializeAuth: () => {
        const tokenFromCookie = Cookies.get('token');
        const authSignature = Cookies.get('tcn');

        if (tokenFromCookie && authSignature) {
          const decodedToken = decodeJWT(tokenFromCookie);

          if (decodedToken && decodedToken.exp > Date.now() / 1000) {
            const user: UserProfile = {
              id: decodedToken?.sub || decodedToken?.id || '',
              tenantId: decodedToken?.tenantId || '',
              email: decodedToken?.email || '',
              name: decodedToken?.name || decodedToken?.username || '',
              role: decodedToken?.role || decodedToken?.roles?.[0] || ''
            };

            set({
              token: tokenFromCookie,
              user,
              decodedToken,
              isAuthenticated: true
            });

            const sessionName = process.env.NEXT_PUBLIC_SESSION_NAME || 'avalidacao';
            const tokenData = localStorage.getItem(`token_${sessionName}`);
            if (tokenData) {
              try {
                const parsedData = JSON.parse(tokenData);
                if (parsedData.refresh_token) {
                  set({ refreshToken: parsedData.refresh_token });
                }
              } catch (error) {
                console.error('Erro ao parsear token do localStorage:', error);
              }
            }
          } else {
            get().logout();
          }
        } else {

          const sessionName = process.env.NEXT_PUBLIC_SESSION_NAME || 'avalidacao';
          const tokenData = localStorage.getItem(`token_${sessionName}`);
          if (tokenData) {
            try {
              const parsedData = JSON.parse(tokenData);
              if (parsedData.access_token) {
                const decodedToken = decodeJWT(parsedData.access_token);

                if (decodedToken && decodedToken.exp > Date.now() / 1000) {
                  get().setAuthData(parsedData);
                } else {
                  get().logout();
                }
              }
            } catch (error) {
              console.error('Erro ao parsear token do localStorage:', error);
              get().logout();
            }
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        decodedToken: state.decodedToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
