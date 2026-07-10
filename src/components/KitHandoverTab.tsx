import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Flex, Input, Typography, type InputRef } from 'antd'
import { GiftOutlined } from '@ant-design/icons'
import { markKitHandover } from '../api/convocation'
import ScanResult from './ScanResult'

const { Title, Text } = Typography

function KitHandoverTab() {
  const [passNumber, setPassNumber] = useState('')
  const inputRef = useRef<InputRef>(null)

  const mutation = useMutation({
    mutationFn: markKitHandover,
    onSuccess: () => {
      setPassNumber('')
      inputRef.current?.focus()
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
        <GiftOutlined />
      </div>
      <Flex vertical align="center" gap={4}>
        <Title level={4} style={{ margin: 0 }}>
          Convocation Kit Handover
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
        autoFocus
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
        Handover Kit
      </Button>

      {mutation.isError && (
        <Alert
          type="error"
          showIcon
          message={mutation.error.message}
          style={{ maxWidth: 480, width: '100%' }}
        />
      )}
      {mutation.isSuccess && <ScanResult result={mutation.data} />}
    </Flex>
  )
}

export default KitHandoverTab
