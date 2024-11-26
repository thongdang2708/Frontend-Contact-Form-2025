
import React from 'react';
import Loading from "../../assets/spinner (1).gif";

function CommonLoading() {
  return (
    <div className="text-center w-100 my-24">
    <img src={Loading} width={180} alt="loading" className="inline-block text-center"/>
    </div>
  )
}

export default CommonLoading