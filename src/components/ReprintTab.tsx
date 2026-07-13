import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Flex, Input, Typography, type InputRef } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import { reprintToken } from '../api/convocation'
import { printPassReceipt } from '../utils/printPass'
import ScanResult from './ScanResult'

const { Title, Text } = Typography

function ReprintTab() {
  const [passNumber, setPassNumber] = useState('')
  const inputRef = useRef<InputRef>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [])

  const mutation = useMutation({
    mutationFn: reprintToken,
    onSuccess: (data) => {
      setPassNumber('')
      inputRef.current?.focus()
      printPassReceipt(data, true)
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
        <PrinterOutlined />
      </div>
      <Flex vertical align="center" gap={4}>
        <Title level={4} style={{ margin: 0 }}>
          Reprint Lost Token
        </Title>
        <Text type="secondary">
          Enter the pass number to reprint the token
        </Text>
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
        icon={<PrinterOutlined />}
        onClick={handleSubmit}
        disabled={!passNumber.trim()}
        loading={mutation.isPending}
        style={{ width: '100%', maxWidth: 340, height: 46 }}
      >
        Reprint Token
      </Button>

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
            onClick={() => printPassReceipt(mutation.data, true)}
          >
            Print Again
          </Button>
        </>
      )}
    </Flex>
  )
}

export default ReprintTab
