import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Flex, Input, Typography, type InputRef } from 'antd'
import { InboxOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { markKitReceived, issueCertificate } from '../api/convocation'
import ScanResult from './ScanResult'

const { Title, Text } = Typography

type Action = 'kit-received' | 'certificate'

function CertificateTab() {
  const [passNumber, setPassNumber] = useState('')
  const inputRef = useRef<InputRef>(null)

  const mutation = useMutation({
    mutationFn: ({ passNumber, action }: { passNumber: string; action: Action }) =>
      action === 'kit-received'
        ? markKitReceived(passNumber)
        : issueCertificate(passNumber),
    onSuccess: () => {
      setPassNumber('')
      inputRef.current?.focus()
    },
  })

  const handleSubmit = (action: Action) => {
    const value = passNumber.trim()
    if (!value || mutation.isPending) return
    mutation.mutate({ passNumber: value, action })
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
        <SafetyCertificateOutlined />
      </div>
      <Flex vertical align="center" gap={4}>
        <Title level={4} style={{ margin: 0 }}>
          Convocation Hand Over &amp; Certificate
        </Title>
        <Text type="secondary">
          Enter the pass number, then choose the action
        </Text>
      </Flex>
      <Input
        ref={inputRef}
        className="scan-input"
        size="large"
        placeholder="Pass Number"
        value={passNumber}
        onChange={(e) => setPassNumber(e.target.value)}
        onPressEnter={() => handleSubmit('certificate')}
        autoFocus
        style={{ width: '100%', maxWidth: 340, height: 52 }}
      />
      <Flex gap={12} style={{ width: '100%', maxWidth: 340 }}>
        <Button
          size="large"
          icon={<InboxOutlined />}
          onClick={() => handleSubmit('kit-received')}
          disabled={!passNumber.trim()}
          loading={
            mutation.isPending && mutation.variables?.action === 'kit-received'
          }
          style={{ flex: 1, height: 46 }}
        >
          Kit Received
        </Button>
        <Button
          className="btn-gradient"
          type="primary"
          size="large"
          icon={<SafetyCertificateOutlined />}
          onClick={() => handleSubmit('certificate')}
          disabled={!passNumber.trim()}
          loading={
            mutation.isPending && mutation.variables?.action === 'certificate'
          }
          style={{ flex: 1, height: 46 }}
        >
          Certificate
        </Button>
      </Flex>

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

export default CertificateTab
