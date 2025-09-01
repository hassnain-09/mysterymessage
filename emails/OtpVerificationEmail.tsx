import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
} from "@react-email/components"

interface OtpEmailProps {
  username?: string
  otp?: string
}

export default function OtpVerificationEmail({ username, otp }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={tertiary}>Verify Your Identity</Text>

          <Heading style={secondary}>Hi {username || "User"},</Heading>
          <Text style={paragraph}>
            Please enter the following code to verify your account.
          </Text>

          <Section style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </Section>

          <Text style={paragraph}>
            If you did not request this verification, you can safely ignore this
            email.
          </Text>
        </Container>

        <Text style={footer}>Securely powered by MysteryMessage</Text>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
}

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "20px",
  maxWidth: "360px",
  margin: "0 auto",
  padding: "40px 0 60px",
}

const tertiary = {
  color: "#0a85ea",
  fontSize: "11px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
  margin: "16px 0 8px",
}

const secondary = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: "24px",
  textAlign: "center" as const,
  margin: "0 0 10px",
}

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  width: "280px",
}

const code = {
  color: "#000",
  fontFamily: "HelveticaNeue-Bold",
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "6px",
  lineHeight: "40px",
  padding: "8px 0",
  textAlign: "center" as const,
}

const paragraph = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  lineHeight: "23px",
  padding: "0 40px",
  margin: "0 0 15px",
  textAlign: "center" as const,
}

const footer = {
  color: "#000",
  fontSize: "12px",
  fontWeight: 800,
  lineHeight: "23px",
  marginTop: "20px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
}
