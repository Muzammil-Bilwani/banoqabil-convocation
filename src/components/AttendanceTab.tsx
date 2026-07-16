import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Flex, Input, Switch, Typography, type InputRef } from 'antd'
import { CheckCircleOutlined, PrinterOutlined } from '@ant-design/icons'
import { markAttendance } from '../api/convocation'
import { printPassReceipt } from '../utils/printPass'
import ScanResult from './ScanResult'

const { Title, Text } = Typography

// Staff can turn auto-printing off when the printer misbehaves; the choice is
// remembered so it survives a reload.
const AUTO_PRINT_KEY = 'convocation:autoPrint'

function readAutoPrint(): boolean {
  return localStorage.getItem(AUTO_PRINT_KEY) !== 'false'
}

function AttendanceTab() {
  const [passNumber, setPassNumber] = useState('')
  const [autoPrint, setAutoPrint] = useState(readAutoPrint)
  const inputRef = useRef<InputRef>(null)

  const handleAutoPrintChange = (checked: boolean) => {
    setAutoPrint(checked)
    localStorage.setItem(AUTO_PRINT_KEY, String(checked))
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [])

  const mutation = useMutation({
    mutationFn: markAttendance,
    onSuccess: (data) => {
      setPassNumber('')
      inputRef.current?.focus()
      if (autoPrint) printPassReceipt(data, data.reprinted)
    },
  })

  const handleSubmit = () => {
    const value = passNumber.trim()
    if (!value || mutation.isPending) return
    mutation.mutate(value)
  }

  return (
    <Flex
      vertical
      align="center"
      gap={16}
      className="scan-panel"
      style={{ paddingTop: 48, paddingBottom: 32 }}
    >
      <div className="scan-icon">
        <CheckCircleOutlined />
      </div>
      <Flex vertical align="center" gap={4}>
        <Title level={4} style={{ margin: 0 }}>
          Mark Attendance
        </Title>
        <Text type="secondary">Enter the student's pass number</Text>
      </Flex>
      <Input
        ref={inputRef}
        className="scan-input"
        size="large"
        placeholder="Pass Number"
        value={passNumber}
        onChange={(e) => setPassNumber(e.target.value)}
        onPressEnter={handleSubmit}
        style={{ width: '100%', maxWidth: 340, height: 52 }}
      />
      <Button
        className="btn-gradient"
        type="primary"
        size="large"
        onClick={handleSubmit}
        disabled={!passNumber.trim()}
        loading={mutation.isPending}
        style={{ width: '100%', maxWidth: 340, height: 46 }}
      >
        Mark Attendance
      </Button>

      <Flex align="center" gap={8}>
        <Switch
          size="small"
          checked={autoPrint}
          onChange={handleAutoPrintChange}
        />
        <Text type="secondary" style={{ fontSize: 13 }}>
          {autoPrint ? 'Auto-print token' : 'Auto-print off'}
        </Text>
      </Flex>

      {mutation.isError && (
        <Alert
          type="error"
          showIcon
          message={mutation.error.message}
          style={{ maxWidth: 480, width: '100%' }}
        />
      )}
      {mutation.isSuccess && (
        <>
          <ScanResult result={mutation.data} />
          <Button
            icon={<PrinterOutlined />}
            onClick={() => printPassReceipt(mutation.data, mutation.data.reprinted)}
          >
            Print Again
          </Button>
        </>
      )}
    </Flex>
  )
}

export default AttendanceTab
