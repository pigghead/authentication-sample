import React from 'react'

export default function RootLayout({ 
    children ,
}: {
    children: React.ReactNode
}) {
  return (
    <>
        <nav>signup NavBar</nav>
        <main>
            {children}
        </main>
    </>
  )
}
