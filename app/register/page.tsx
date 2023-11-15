"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { userStore } from "@/store/AuthUserStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
type Inputs = {
  Name: string;
  Email: string;
  Password: string;
  RePassword?: string;
};

function Register() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("trello")!)
      : undefined;
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [registerUser] = userStore((state) => [state.registerUser]);
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isValid) {
      setLoading(true);
      const registerForm: Inputs = {
        Name: data.Name,
        Email: data.Email,
        Password: data.Password,
      };
      const result = await registerUser(registerForm);
      if (result) {
        if (result.statusCode === 200) {
          toast.success("Register successfully");
          reset();
        } else if (result.statusCode === 409) {
          setError(result.message);
        } else if (result.statusCode === 500) {
          setError(result.message);
        }
      }
      setLoading(false);
    }
  };
  if (user) {
    return router.push("/");
  } else {
    return (
      <section className="bg-slate-600 lg:h-screen">
        <div className="container relative h-full px-6 py-24">
          <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
              <Image
                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                className="w-full"
                alt="Phone image"
                width={200}
                height={400}
              />
            </div>

            <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
              <h2 className="text-5xl p-5 text-center text-white">Register</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative" data-te-input-wrapper-init>
                  <input
                    className="peer h-full w-full rounded-[7px] border border-gray-500 border-t-transparent bg-transparent placeholder-shown:border placeholder-shown:border-gray-500 placeholder-shown:border-t-gray-500 px-3 py-4 font-sans text-sm font-normal text-white outline outline-none transition-all focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border disabled:bg-gray-500"
                    placeholder=" "
                    type="text"
                    {...register("Name", {
                      required: true,
                      maxLength: 10,
                      minLength: 3,
                    })}
                  />
                  <label className="before:content[' '] after:content[' '] border-t-transparent pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-300 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.4 before:w-2.5 before:rounded-tl-md  before:border-gray-500 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-500 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.3] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-500">
                    Name
                  </label>
                </div>
                {errors.Name?.type === "required" && (
                  <span className="text-red-500 font-semibold">
                    This field is required
                  </span>
                )}
                {errors.Name?.type === "maxLength" && (
                  <span className="text-red-500 font-semibold">
                    Name must be 3 to 10 characters
                  </span>
                )}
                {errors.Name?.type === "minLength" && (
                  <span className="text-red-500 font-semibold">
                    Name must be 3 to 10 characters
                  </span>
                )}
                <div className="relative mt-6" data-te-input-wrapper-init>
                  <input
                    className="peer h-full w-full rounded-[7px] border border-gray-500 border-t-transparent bg-transparent placeholder-shown:border placeholder-shown:border-gray-500 placeholder-shown:border-t-gray-500 px-3 py-4 font-sans text-sm font-normal text-white outline outline-none transition-all focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border disabled:bg-gray-500"
                    placeholder=" "
                    type="text"
                    {...register("Email", {
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  <label className="before:content[' '] after:content[' '] border-t-transparent pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-300 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.4 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-gray-500 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-500 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.3] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-500">
                    Email
                  </label>
                </div>
                {errors.Email?.type === "required" && (
                  <span className="text-red-500 font-semibold">
                    This field is required
                  </span>
                )}
                {errors.Email?.message && (
                  <span className="text-red-500 font-semibold">
                    {errors.Email?.message}
                  </span>
                )}
                {error && (
                  <span className="text-red-500 font-semibold">{error}</span>
                )}
                <div className="relative mt-6" data-te-input-wrapper-init>
                  <input
                    className="peer h-full w-full rounded-[7px] border border-gray-500 border-t-transparent bg-transparent placeholder-shown:border placeholder-shown:border-gray-500 placeholder-shown:border-t-gray-500 px-3 py-4 font-sans text-sm font-normal text-white outline outline-none transition-all focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border disabled:bg-gray-500"
                    placeholder=" "
                    type="password"
                    {...register("Password", {
                      required: true,
                      minLength: 8,
                      maxLength: 15,
                    })}
                  />
                  <label className="before:content[' '] after:content[' '] border-t-transparent pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-300 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.4 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-gray-500 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-500 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.3] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-500">
                    Password
                  </label>
                </div>
                {errors.Password?.type === "required" && (
                  <span className="text-red-500 font-semibold">
                    This field is required
                  </span>
                )}{" "}
                {errors.Password?.type === "maxLength" && (
                  <span className="text-red-500 font-semibold">
                    Password must be 8 to 15 characters
                  </span>
                )}
                {errors.Password?.type === "minLength" && (
                  <span className="text-red-500 font-semibold">
                    Password must be 8 to 15 characters
                  </span>
                )}
                <div className="relative mt-6" data-te-input-wrapper-init>
                  <input
                    className="peer h-full w-full rounded-[7px] border border-gray-500 border-t-transparent bg-transparent placeholder-shown:border placeholder-shown:border-gray-500 placeholder-shown:border-t-gray-500 px-3 py-4 font-sans text-sm font-normal text-white outline outline-none transition-all focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border disabled:bg-gray-500"
                    placeholder=" "
                    type="password"
                    {...register("RePassword", {
                      validate: () => {
                        if (watch("Password") != watch("RePassword")) {
                          return "Your passwords do no match";
                        }
                      },
                    })}
                  />
                  <label className="text-gray-300 before:content[' '] after:content[' '] border-t-transparent pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[14px] font-normal leading-tight transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.4 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-gray-500 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-500 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.3] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-500">
                    RePassword
                  </label>
                </div>
                {errors.RePassword?.message && (
                  <span className="text-red-500 font-semibold">
                    Password and RePassword must be same
                  </span>
                )}
                <button
                  type="submit"
                  className="flex justify-center mt-6 border disabled:bg-green-300 disabled:cursor-not-allowed bg-green-500 border-gray-500 w-full rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                      fill="#fff"
                    >
                      <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
                    </svg>
                  ) : (
                    <p>Register</p>
                  )}
                </button>
              </form>
            </div>
          </div>
          <a
            href="/login"
            className="absolute top-2 left-2 inline-flex items-center justify-center font-semibold w-full px-2 py-1 mb-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-400 sm:w-auto sm:mb-0"
            data-primary="green-400"
            data-rounded="rounded-2xl"
            data-primary-reset="{}"
          >
            <svg
              className="w-4 h-4 mr-1 rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Get Started
          </a>
        </div>
        <ToastContainer />
      </section>
    );
  }
}

export default Register;
