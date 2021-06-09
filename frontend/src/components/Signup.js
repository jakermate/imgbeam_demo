import React from 'react'

export default function Signup() {
    return (
        <div id="signup-form-panel" class="text-black mt-12 border-2 mt-2 bg-white max-w-lg rounded-md px-6 py-8">
        
          <form
            action="/signup"
            method="POST"
            class="flex flex-col max-w-2xl mx-auto text-sm mx-6"
          >
            <label class="hidden mb-1 font-bold text-xs text-gray-700" for="username">Username</label>
            <input
              class="border-2 border-gray-300 rounded-md px-4 py-2 mb-4 bg-gray-300 placeholder-gray-600 focus:border-2 focus:outline-none focus:border-purple-500"
              type="text"
              name="username"
              placeholder="username"
              required
            />
            <label class="hidden mb-1 font-bold text-xs text-gray-700" for="email">Email</label>
            <input
              class="border-2 border-gray-300 rounded-md px-4 py-2 mb-4 bg-gray-300 placeholder-gray-600 focus:border-2 focus:outline-none focus:border-purple-500"
              type="text"
              name="email"
              placeholder="email"
              required
            />
            <label class="hidden mb-1 font-bold text-xs text-gray-700" for="password">Password</label>

            <input
              class="border-2 border-gray-300 rounded-md px-4 py-2 mb-4 bg-gray-300 placeholder-gray-600 focus:border-2 focus:outline-none focus:border-purple-500"
              type="password"
              name="password"
              placeholder="password"
              required
            />
            <label class="hidden mb-1 font-bold text-xs text-gray-700" for="retype-password">Confirm Password</label>

            <input
              class="border-2 border-gray-300 rounded-md px-4 py-2 mb-4 bg-gray-300 placeholder-gray-600 focus:border-2 focus:outline-none focus:border-purple-500"
              type="password"
              name="retype-password"
              placeholder="retype password"
              required
            />
            <button
              class="px-4 mb-4 py-2 bg-green-500 text-white rounded-md"
              type="submit"
            >
              Lets Go!
            </button>
          </form>
          <div id="or-sign-in" class="w-full mb-6 flex flex-col justify-center items-center">
            <div class="text-xs mb-4">or</div>
            <a href="/login" class="text-purple-500 text-sm">Sign-In</a>

          </div>
          <hr />
          <div class="flex mt-4 flex-col justify-center items-center">
            <a href="/login/forgotpassword" class="text-xs">Forgot your password?</a>
          </div>
    </div>
    )
}
