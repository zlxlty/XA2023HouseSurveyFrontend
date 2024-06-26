import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Error({
  error,
}: {
  error: Error
}) {
  const navigate = useNavigate()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error({ error })
    navigate('/discover')
  }, [error])
  return <></>
}
