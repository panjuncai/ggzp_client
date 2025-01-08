import {Component} from 'react'
import logo from './logo3.png'
import './logo.sass'

export default class Logo extends Component{
    render(){
        return (
            <div className="logo-container">
                <img src={logo} alt="logo" className="logo-img" />
            </div>
        )
    }
}