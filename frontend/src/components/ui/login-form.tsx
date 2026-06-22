import { useState } from "react"
import { cn } from "@/lib/utils"
import { EyeOffIcon, EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$.!%*?&])[A-Za-z\d@$.!%*?&]{8,}$/

interface LoginFormProps {
  className?: string;
  email: string;
  password: string;
  error?: string;
  isLoading: boolean;
  handleSubmit?: (e: React.FormEvent) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

export function LoginForm({
  className,
  email,
  password,
  error,
  isLoading,
  handleSubmit,
  setEmail,
  setPassword,
}: LoginFormProps) {

  const [showInvalidEmail, setShowInvalidEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isEmailValid = EMAIL_PATTERN.test(email.trim())
  const isPasswordValid = PASSWORD_PATTERN.test(password)
  const isSubmitDisabled = isLoading || !isEmailValid || !isPasswordValid

  const handleOnBlurEmail = () => {
    setShowInvalidEmail(!isEmailValid);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Sign in to Casino</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleOnBlurEmail}
                  onFocus={() => setShowInvalidEmail(false)}
                  disabled={isLoading}
                />
                {showInvalidEmail && <FieldError>Invalid email</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup>

                  <InputGroupInput 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-16"
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      disabled={isLoading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 mr-2"
                    >
                      {showPassword ? <EyeOffIcon size={16}/> : <EyeIcon size={16}/>}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError>{error}</FieldError>
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitDisabled}>Login</Button>
                {isLoading && (
                  <div className="text-sm text-muted-foreground">
                    Logging in...
                  </div>
                )}
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/register">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
