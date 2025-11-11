import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormData } from "@/schema/authSchema"
import useAuthStore from "@/stores/useAuthStore"
import { useNavigate } from "react-router"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    // Goi api o backend de dang ky
    const { firstName, lastName, username, email, password } = data
    await signUp(username, password, firstName, lastName, email);

    // Chuyen den trang dang nhap
    navigate("/login");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col text-center gap-2">
                <a href="/">
                  <img src="/logo.svg" alt="logo" className="mx-auto block w-fit text-center" />
                </a>
                <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
                <p className="text-muted-foreground text-balance">
                  Chào mừng bạn! Hãy đăng ký để bắt đầu!
                </p>
              </div>

              {/* Ho va ten */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm">Họ</Label>
                  <Input type="text" id="lastname" placeholder="Họ ..."
                    {...register("lastName")} />

                  {/* Message */}
                  {errors.lastName && (
                    <p className="text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}

                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="block text-sm">Tên</Label>
                  <Input type="text" id="firstname" placeholder="Tên ..."
                    {...register("firstName")} />
                  {/* Message */}
                  {errors.firstName && (
                    <p className="text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Ten dang nhap */}
              <div className="space-y-2">
                <Label htmlFor="username" className="block text-sm">Tên đăng nhập</Label>
                <Input type="text" id="username" placeholder="comics"
                  {...register("username")} />
                {/* Message */}
                {errors.username && (
                  <p className="text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm">Email</Label>
                <Input type="email" id="email" placeholder="comics@gmail.com"
                  {...register("email")} />
                {/* Message */}
                {errors.email && (
                  <p className="text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm">Password</Label>
                <Input type="password" id="password"
                  {...register("password")} />
                {/* Message */}
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* Confirm password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="block text-sm">Confirm Password</Label>
                <Input type="password" id="confirm-password"
                  {...register("confirmPassword")} />
                {/* Message */}
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {/* Button xac nhan */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                Tạo tài khoản
              </Button>
              <div>
                Đã có tài khoản?{" "}
                <a href="/login" className="text-sm text-primary hover:underline">
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:underline">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  )
}
