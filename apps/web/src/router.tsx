import RootLayout from '#/app/layout'
import { Route, Routes } from 'react-router-dom'
import Mirro from '#/app/mirro/wrapped'
import Login from '#/app/login/wrapped'
import Discover from '#/app/discover/wrapped'
import Onboarding from '#/app/onboarding/wrapped'
import ProfileSettings from '#/app/profile-settings/wrapped'
import Chat from '#/app/chat/[...config]/wrapped'
import ChatList from '#/app/chat-list/wrapped'
import Match from '#/app/match/wrapped'
import Moment from '#/app/moment/wrapped'
import MomentTimeline from '#/app/moment/@timeline/wrapped'
import MomentWebcam from '#/app/moment/@webcam/wrapped'
import Profile from '#/app/profile/[id]/wrapped'
import SmartInput from '#/app/profile-settings/smart-input/wrapped'
import * as Sentry from '@sentry/react';

// For XA Sorting Hat
import XASmartInput from '#/app/xa/wrapped'

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

export default function Router() {
  return (
    <SentryRoutes>
      <Route path="/" element={<RootLayout />}>
        <Route path="mirro" element={<Mirro />} />
        <Route path="login" element={<Login />} />
        <Route path="discover" element={<Discover />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="profile-settings" element={<ProfileSettings />} />
        <Route path="profile-settings/smart-input" element={<SmartInput />} />
        <Route path="chat/:chatType/:paramId" element={<Chat />} />
        <Route path="chat-list" element={<ChatList />} />
        <Route path="match" element={<Match />} />
        <Route path="moment" element={<Moment />} />
        <Route path="moment/@timeline" element={<MomentTimeline />} />
        <Route path="moment/@webcam" element={<MomentWebcam />} />
        <Route path="profile/:id" element={<Profile />} />        
        <Route path="xa" element={<XASmartInput />}/>
      </Route>
    </SentryRoutes>
  )
}
