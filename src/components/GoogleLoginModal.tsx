import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from './ui/dialog';
import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';

interface GoogleJwtPayload {
  name?: string;
}

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useUser();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Sign in to UnifyAI
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Continue with Google to access all features and save your progress.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <GoogleLogin
            onSuccess={credentialResponse => {
              if (credentialResponse.credential) {
                const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
                login({
                  name: decoded.name || 'Google User',
                  jwt: credentialResponse.credential,
                });
                onClose();
              }
            }}
            onError={() => {
              alert('Google Login Failed');
            }}
            width="100%"
          />
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 transition-colors py-2"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleLoginModal;