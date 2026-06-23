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
import type { Country } from "@/types/country"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EMAIL_PATTERN, PASSWORD_PATTERN } from "@/types/constants"
import { useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"
import { EyeIcon, EyeOffIcon } from "lucide-react"

interface SignupFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  countryIso2: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setCountryIso2: (countryIso2: string) => void;
  handleSubmit?: (e: React.FormEvent) => void;
  isLoading: boolean;
  countries: Country[];
  error?: string;
}

export function SignupForm({ 
  email, 
  password, 
  confirmPassword, 
  countryIso2, 
  setEmail, 
  setPassword, 
  setConfirmPassword, 
  setCountryIso2,
  handleSubmit,
  isLoading,
  countries,
  error
}: SignupFormProps) {

  const [showInvalidEmail, setShowInvalidEmail] = useState(false);
  const [showInvalidPassword, setShowInvalidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isEmailValid = EMAIL_PATTERN.test(email.trim())
  const isPasswordValid = PASSWORD_PATTERN.test(password)
  const isConfirmPasswordValid = confirmPassword === password
  const isSubmitDisabled = isLoading || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !countryIso2

  const handleOnBlurEmail = () => {
    setShowInvalidEmail(!isEmailValid);
  }
  const handleOnBlurPassword = () => {
    setShowInvalidPassword(!isPasswordValid);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}  className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
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
                  autoComplete="new-password"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleOnBlurPassword}
                  disabled={isLoading}
                  placeholder="Input your password"
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
              {showInvalidPassword && <FieldError>Invalid password</FieldError>}
              <FieldDescription className="text-xs">Min 8 chars, uppercase, lowercase, number, special</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <InputGroup>

                <InputGroupInput 
                  id="confirm-password" 
                  name="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Confirm your password"
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
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            
            <FieldGroup>
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <Select
                name="country"
                value={countryIso2}
                onValueChange={setCountryIso2}
                disabled={isLoading}
                required
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.iso2} value={country.iso2}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{error}</FieldError>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isSubmitDisabled}>Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
