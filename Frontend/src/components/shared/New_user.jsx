import React from 'react'
import Button from '../ui/button'
import { Link } from 'react-router-dom'

const New_user = () => {
  return (
    <div className='sticky top-0 z-10'>

    <div className='bg-white sticky z-10 top-0 my-2'>
        <div className='flex items-center justify-between mx-auto max-w-7xl size_1:flex-row gap-5 flex-col h-16'>
          <div>
            <h1 className='text-2xl font-bold'>
              <Link to="/" className="text-inherit">
                Career<span className="text-blue-600">Xpert</span>
              </Link>
            </h1>
          </div>
          <div className='flex justify-center gap-5 items-center'>
            <ul className='flex  cursor-pointer font-medium items-center gap-5'>
              <li className="relative group pb-1">
                <Link to="/">
                  <span>Home</span>
                </Link>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </li>
              <li className="relative group pb-1">
              <Link to="/jobs">
                  <span>Jobs</span>

                </Link>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </li>

              <div className='flex items-center justify-center cursor-pointer'>
                <Link to={"/login"}> <li><Button name="Login"></Button></li></Link>
                <Link to={"/signup"}><li><Button name="Signup"></Button></li></Link>
              </div>
            </ul>

          </div>
        </div>
      </div>

    </div>
  )
}

export default New_user