export function getRedirectPath(type,header){
    let path=''

    path+=type==='laoban'?'/laoban':'/dashen'
    if(!header){
        path+='info'
    }

    return path
}