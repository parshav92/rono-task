import React, { useState, useEffect } from "react";
import { AlchemySigner } from "@alchemy/aa-alchemy";
import { useMutation } from "@tanstack/react-query";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

const AuthComponent = () => {
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [signer, setSigner] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const newSigner = new AlchemySigner({
      client: {
        connection: {
          jwt: process.env.REACT_APP_ALCHEMY_API_KEY,
        },
        iframeConfig: {
          iframeContainerId: "turnkey-iframe-container",
        },
      },
    });
    setSigner(newSigner);
  }, []);

  const { mutate: authenticate, isLoading: isAuthenticating } = useMutation({
    mutationFn: () =>
      signer.authenticate({
        type: "passkey",
        createNew: isSigningUp,
        username: isSigningUp ? username : undefined,
      }),
    onSuccess: (data) => {
      if (data.credentialId) {
        login(data.credentialId);
        navigate("/live");
      } else {
        setError("Biometric authentication failed. Please try again.");
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    authenticate();
    console.log(authenticate());
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="p-6 bg-gray-800 rounded-lg shadow-md w-96">
        {isAuthenticating ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold mb-6 text-center">
              {isSigningUp ? "Sign Up" : "Sign In"}
            </h1>
            {isSigningUp && (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required={isSigningUp}
                className="bg-gray-700 text-white rounded-md py-2 px-3 w-full"
              />
            )}
            <button
              type="submit"
              disabled={!signer}
              className="w-full bg-blue-500 py-2 rounded-md text-white font-semibold hover:bg-blue-600"
            >
              {isSigningUp ? "Sign Up" : "Sign In"}
            </button>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSigningUp(!isSigningUp)}
                className="text-blue-400 hover:underline"
              >
                {isSigningUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        )}
        <div id="turnkey-iframe-container" />
      </div>
    </div>
  );
};

export default AuthComponent;
