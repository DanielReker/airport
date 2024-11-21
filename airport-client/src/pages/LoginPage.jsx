import {SignInPage} from "@toolpad/core";
import {useSession} from "../contexts/SessionContext.jsx";
import {useNavigate} from "react-router-dom";

const fakeAsyncGetSession = async (formData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (formData.get('password') === 'password') {
                resolve({
                    name: 'Bharat Kashyap',
                    email: formData.get('email') || '',
                    image: 'https://avatars.githubusercontent.com/u/19550456',
                });
            }
            reject(new Error('Incorrect credentials.'));
        }, 1000);
    });
};



const LoginPage = () => {
    const {setSession} = useSession();
    const navigate = useNavigate();

    return (
        <SignInPage
            providers={[{ id: 'credentials', name: 'Credentials' }]}
            signIn={async (provider, formData, callbackUrl) => {
                // Demo session
                try {
                    const session = await fakeAsyncGetSession(formData);
                    if (session) {
                        setSession(session);
                        navigate(callbackUrl || '/', { replace: true });
                        return {};
                    }
                } catch (error) {
                    return {
                        error: error instanceof Error ? error.message : 'An error occurred',
                    };
                }
                return {};
            }}
        />
    );
};

export default LoginPage;