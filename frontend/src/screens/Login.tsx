import { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email === "" || password === "") {
            toast.error("All fields must be filled");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            await setUser(data);
            navigate('/game');
        }
        catch (error) {
            toast.error("Incorrect credentials");
        }
    }

    return (
        <div className='flex'>
            <form onSubmit={handleSubmit}
                className='flex py-5 flex-col w-full justify-center items-center'
            >
                <h1
                    className='text-white text-4xl mb-10'
                >
                    Login
                </h1>

                <span className='flex flex-col'>
                    <label htmlFor='email' className='mb-1 text-white'>Email</label>
                    <input
                        name='email'
                        type='text'
                        placeholder='Email'
                        className='mb-5 py-2 px-3 w-[30vw] border-2 bg-black text-white'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </span>
                <span className='flex flex-col'>
                    <label htmlFor='password' className='mb-1 text-white'>Password</label>
                    <input
                        name='password'
                        type='password'
                        placeholder='Password'
                        className='mb-5 py-2 px-3 w-[30vw] border-2 bg-black text-white'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </span>
                <button className='w-[30vw] bg-blue-500 hover:bg-blue-600 py-2'>
                    LOGIN
                </button>
                <span className='mt-2 text-white'>
                    Already have an account?{" "}
                    <Link to='/signup' className='text-blue-500 hover:underline'>
                        Signup
                    </Link>
                </span>
            </form>
        </div>
    )
}

export default Login;