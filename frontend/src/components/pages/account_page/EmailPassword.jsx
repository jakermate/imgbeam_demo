import React from "react"
import styled from "styled-components"
export default function EmailPassword(props) {
  return (
    <div>
      <h2 className="font-bold text-2xl">Email</h2>
      <p className="text-green-500 font-bold">{props.user.email}</p>
      <h2 className="font-bold text-2xl mt-8">Change Password</h2>
      <form action="/api/account/password/update" id="password-change" className="flex flex-col mt-6 max-w-lg" method="POST">
        <label className="font-bold text-sm" htmlFor="password-old">Current Password</label>
        <Input id="password-old" name="password-old" type="password" />
        <label className="font-bold text-sm mt-6" htmlFor="password-new-1">New Password</label>
        <Input id="password-new-1" name="password-new-1" type="password" />
        <label className="font-bold text-sm" htmlFor="password-new-2">Confirm New Password</label>
        <Input id="password-new-2" name="password-new-2" type="password" />

        <p className="text-xs opacity-50 mt-2">New password must contain at least one letter and one number, and be alphanumeric. Special characters and spaces are not allowed.</p>
        <input type="submit"  className="bg-green-400 mt-6 py-2 font-bold hover:opacity-50"  value="Change Password" />
      </form>
    </div>
  )
}
const Input = styled.input`
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 0.5rem;
  outline: none;
  border: none;
  margin: 0.5rem 0;
`
