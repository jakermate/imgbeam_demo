import React from 'react'

export default function SignIn() {
    return (
        <div className="bg-white rounded-lg mt-12 mb-12 px-6 py-6">

            <form action="/login" method="POST" class="flex flex-col max-w-2xl mx-auto" >
            <input class="border-2 border-gray-300 rounded-md px-4 py-2 mb-4" type="text" name="username" placeholder="username or email" />
            <input class="border-2 border-gray-300 rounded-md px-4 py-2 mb-4" type="text" name="password" placeholder="password" />
            <button class="px-4 mb-8 py-2 bg-blue-500 text-white rounded-md"  type="submit">Login</button>
        </form>
        </div>
    )
}
