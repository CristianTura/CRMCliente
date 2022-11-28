import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({children}) => {
  const router = useRouter()
  return (
    <>
        <Head>
            <title>CRM - Administración de clientes</title>
        </Head>
        {router.pathname === '/login' || router.pathname === '/nuevacuenta' ? (
          <div className='bg-gray-800 min-h-screen flex flex-col justify-center'>
            <div>
              {children}
            </div>
          </div>
        ): (
          <div className='bg-gray-200 min-h-screen'>
            <div className='sm:flex min-h-screen'>
              <Sidebar/>
              <main className='sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5'>
                <Header/>
                {children}
              </main>
            </div>
          </div>
        )}
    </>
  )
}

export default Layout