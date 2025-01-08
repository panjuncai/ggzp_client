import {useState,useEffect} from 'react'
import { List } from 'antd-mobile'

export default ()=>{
    const [headerList, setHeaderList] = useState([])
    const [state,setState]=useState({icon:null})
    const {icon}=state
    const gridHeader =icon?<p>已选择头像：<img src={icon} alt='header' /></p>:'请选择头像'

    useEffect(() => {
      for(let i=0;i<8;i++){
        const text=`头像${i+1}`
        headerList.push({text,icon:require(`../../assets/images/${text}.png`)})
      }
    })
    
    return (
        <div>上传头像</div>
    )
}