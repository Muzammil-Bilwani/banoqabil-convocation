import { clearSession } from './auth'
import { BASE_URL } from './config'

export interface Student {
  _id: string
  fullName: string
  studentId: string
  gender: string
  cnic: string
  phoneNumber: string
}

export interface ConvocationPass {
  _id: string
  convocationId: string
  studentId: string
  passNumber: number
  cluster: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface PassActionResponse {
  message: string
  passNumber: number
  student: Student
  pass: ConvocationPass
}

export type PassStatus = 'ConvocationKitReceived' | 'CertificateHandover'

async function authRequest(
  path: string,
  options: RequestInit = {},
): Promise<PassActionResponse> {
  const token = localStorage.getItem('accessToken')

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (res.status === 401) {
    clearSession()
    window.location.reload()
    throw new Error('Session expired. Please sign in again.')
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const body = data as { message?: string; error?: string }
    if (res.status === 403) {
      throw new Error('You are not allowed to perform this action.')
    }
    throw new Error(
      body.message ?? body.error ?? `Request failed (${res.status})`,
    )
  }

  return data as PassActionResponse
}

export function markAttendance(passNumber: string) {
  return authRequest(
    `/convocation-passes/pass-number/${encodeURIComponent(passNumber)}/attend`,
    { method: 'PATCH' },
  )
}

export function markKitHandover(passNumber: string) {
  return authRequest(
    `/convocation-passes/pass-number/${encodeURIComponent(passNumber)}/kit-handover`,
    { method: 'PATCH' },
  )
}

export function updatePassStatus(passNumber: string, status: PassStatus) {
  return authRequest(
    `/convocation-passes/pass-number/${encodeURIComponent(passNumber)}/status`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
  )
}
