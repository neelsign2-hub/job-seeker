import React from 'react'

const Button = (props) => {
  return (
    <div className=' text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>
         {props.name}
    </div>
  )
}

export default Button
