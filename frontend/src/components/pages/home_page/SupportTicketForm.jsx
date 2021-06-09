import { useState } from "react"
import React, {useState, useEffect} from 'react'

export default function SupportTicketForm(props) {
    return (
        <div className="container bg-white text-black">
        <input type="text" name="subject" id=""/>
            <textarea name="info" id="" cols="30" rows="10"></textarea>
        </div>
    )
}
