import axios from "axios";
import { useState,useEffect } from "react";
import NavbarComponent from "./NavbarComponent";
import renderHTML from "react-render-html";

const SingleComponent=(props)=>{
    const [blog,setBlog] = useState('')

    useEffect(()=>{
        axios
        .get(`${process.env.REACT_APP_API}/blog/${props.match.params.slug}`)
        .then(response=>{
            setBlog(response.data)
        })
        .catch(err=>alert(err))
        // eslint-disable-next-line
    },[])

    return(
        <div className="container p-5">
            <NavbarComponent/>
            {blog && 
            <div>
                <h1>{blog.title}</h1>
                <div className="pt-3">{renderHTML(blog.content)}</div>
                <p className="text-muted"> ผู้เขียน: {blog.author} , เผยแพร่ : {new Date(blog.createdAt).toLocaleString()}</p>
            </div>}
        </div>
    )
}

export default SingleComponent;