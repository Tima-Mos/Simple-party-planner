import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RoomProvider } from '@/store/RoomContext'
import HomeScreen from '@/components/HomeScreen'
import RoomPage from '@/components/RoomPage'

export default function App() {
  return (
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
        </Routes>
      </RoomProvider>
    </BrowserRouter>
  )
}
