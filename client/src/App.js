import NavbarComponent from "./components/NavbarComponent";
import axios from "axios"
import {useState,useEffect} from "react"
import {Link} from "react-router-dom"
import Swal from "sweetalert2"
import renderHTML from "react-render-html"
import { getUser ,getToken } from "./services/authorize";

function App() {
  const [blogs,setBlogs] = useState([])

  const fetchData=()=>{
      axios
      .get(`${process.env.REACT_APP_API}/blogs`)
      .then(response=>{
          setBlogs(response.data)
      })
      .catch(err=>alert(err));
  }
  useEffect(()=>{
    fetchData()
  },[])

  const confirmDelete=(slug)=>{
      Swal.fire({
          title:"คุณต้องการลบบทความหรือไม่ ?",
          icon:"warning",
          showCancelButton:true
      }).then((result)=>{
          //กดปุ่ม ok หรือตกลง
          if(result.isConfirmed){
            deleteBlog(slug)
          }
      })
  }

  const deleteBlog=(slug)=>{
    //ส่ง request ไปที่ api เพื่อลบข้อมูล
    axios
    .delete(`${process.env.REACT_APP_API}/blog/${slug}`,
      {
        headers:{
            authorization:`Bearer ${getToken()}`
        }
    })
    .then(response=>{
        Swal.fire("Deleted!",response.data.message,"success")
        fetchData()
    }).catch(err=>console.log(err))
  }
  return (
    <div className="container p-5">
      <NavbarComponent/>
      {blogs.map((blog,index)=>(
          <div className="row" key={index} style={{borderBottom:'1px solid silver'}}>
              <div className="col pt-3 pb-2">
                  <Link to={`/blog/${blog.slug}`}>
                    <h2>{blog.title}</h2>
                  </Link>
                  <div className="pt-3">{renderHTML(blog.content.substring(0,250))}</div>
                  <p className="text-muted"> ผู้เขียน: {blog.author} , เผยแพร่ : {new Date(blog.createdAt).toLocaleString()}</p>
                  { getUser() && (
                    <div>
                      <Link className="btn btn-outline-success" to={`/blog/edit/${blog.slug}`}>แก้ไขบทความ</Link> &nbsp;
                      <button className="btn btn-outline-danger" onClick={()=>confirmDelete(blog.slug)}>ลบบทความ</button>
                    </div>
                  )}
              </div>
          </div>
      ))}
    </div>
  );
}

export default App;
