import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "@/schema/authSchema"
import { useNavigate } from "react-router"
import useAuthStore from "@/stores/useAuthStore"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    // Goi api o backend de dang ky
    const { username, password } = data;
    await login(username, password);

    // Chuyen den trang dang nhap
    navigate("/");
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
                <h1 className="text-2xl font-bold">Đăng nhập tài khoản</h1>
                <p className="text-muted-foreground text-balance">
                  Chào mừng trở lại! Hãy đăng nhập để trải nghiệm!
                </p>
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

              {/* Button xac nhan */}
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
              <div>
                Chưa có tài khoản?{" "}
                <a href="/register" className="text-sm text-primary hover:underline">
                  Đăng ký
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
