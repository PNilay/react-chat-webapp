import React from 'react'
import "./NameTag.css";

function NameTag({name}) {
  return (
    <span className='nameTag'>
      {name}
    </span>
  )
}

export default NameTag
