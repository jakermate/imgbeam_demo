import React from 'react'

export default function CreatePost() {
    return (
        <div className="bg-white mt-24 rounded-md px-6 py-8 mx-auto max-w-2xl text-black">
        <h1 className="font-bold text-4xl text-black">
            new post
        </h1>
            <form action="/upload/create" method="POST" encType="multipart/form-data">
            <input type="file" name="image" id="" accept=".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp,.xcf,.webp,.mp4,.mov,.avi,.webm,.mpeg,.flv,.mkv,.mpv,.wmv" />
            <button type="submit" value="" className="bg-purple-500 rounded-lg text-white font-bold px-8 py-4">Go</button>
            </form>
        </div>
    )
}
