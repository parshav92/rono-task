import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div class="grid h-screen place-content-center bg-gray-900 px-4">
      <div class="text-center">
        <h1 class="text-9xl font-black text-gray-200">404</h1>

        <p class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </p>

        <p class="my-4 text-gray-500">We can't find that page.</p>

        <Link
          to="/"
          class="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700"
        >
          back to homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
