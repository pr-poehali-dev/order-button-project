import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showTeam, setShowTeam] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) =>
          file.type.includes("video") ||
          file.type.includes("gif") ||
          file.name.endsWith(".mp4") ||
          file.name.endsWith(".gif"),
      );

      if (validFiles.length !== files.length) {
        toast({
          title: "Внимание",
          description:
            "Некоторые файлы не поддерживаются. Принимаются только .mp4 и .gif файлы.",
          variant: "destructive",
        });
      }

      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOrderSubmit = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, загрузите файлы для монтажа",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Заказ принят!",
      description: `Ваш заказ на монтаж ${selectedFiles.length} файлов принят. Мы свяжемся с вами в ближайшее время.`,
    });

    setIsOrderOpen(false);
    setSelectedFiles([]);
  };

  const team = [
    { name: "Алексей Монтажёв", role: "Ведущий монтажер", experience: "8 лет" },
    { name: "Мария Видеоскоп", role: "Монтажер-колорист", experience: "6 лет" },
    { name: "Дмитрий Эффектов", role: "Моушн-дизайнер", experience: "5 лет" },
    { name: "Анна Звуковая", role: "Звукорежиссёр", experience: "7 лет" },
    {
      name: "Игорь Кинематограф",
      role: "Старший монтажер",
      experience: "10 лет",
    },
    { name: "София Креативная", role: "Арт-директор", experience: "4 года" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Icon name="Video" size={28} className="text-primary" />
              <h1 className="text-xl font-bold">VideoEdit Pro</h1>
            </div>
            <div className="flex space-x-6">
              <Button variant="ghost" onClick={() => setShowTeam(false)}>
                Главная
              </Button>
              <Button variant="ghost" onClick={() => setShowTeam(true)}>
                О нас
              </Button>
              <Button variant="ghost" onClick={() => navigate("/game")}>
                🎮 Игра
              </Button>
              <Dialog open={isOrderOpen} onOpenChange={setIsOrderOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                    Заказать
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      {!showTeam ? (
        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="relative mb-8">
              <img
                src="/img/043b1fa8-457f-471e-b970-ade07fd9e85d.jpg"
                alt="Профессиональная студия видеомонтажа"
                className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
              <div className="absolute bottom-8 left-8 text-left">
                <h1 className="text-5xl font-bold mb-4 text-white">
                  Профессиональный
                  <br />
                  <span className="text-primary">Видеомонтаж</span>
                </h1>
                <p className="text-xl text-white/90 mb-6">
                  Превращаем ваши идеи в кинематографические шедевры
                </p>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              Наши услуги
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card hover:bg-card/80 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <Icon
                    name="Scissors"
                    size={32}
                    className="text-primary mb-2"
                  />
                  <CardTitle>Монтаж видео</CardTitle>
                  <CardDescription>
                    Профессиональная нарезка и склейка видеоматериала
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Создаем динамичные и захватывающие видео из вашего материала
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card hover:bg-card/80 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <Icon
                    name="Palette"
                    size={32}
                    className="text-primary mb-2"
                  />
                  <CardTitle>Цветокоррекция</CardTitle>
                  <CardDescription>
                    Профессиональная обработка цвета и света
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Придаем вашим видео киношный вид и атмосферу
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card hover:bg-card/80 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <Icon name="Zap" size={32} className="text-primary mb-2" />
                  <CardTitle>Спецэффекты</CardTitle>
                  <CardDescription>
                    Добавление визуальных эффектов и анимации
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Создаем впечатляющие эффекты для ваших проектов
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Не умеешь монтировать? Закажи у нас!
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Наши профессионалы создадут идеальный видеоконтент для ваших целей
            </p>
            <Dialog open={isOrderOpen} onOpenChange={setIsOrderOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
                >
                  <Icon name="Upload" size={20} className="mr-2" />
                  Загрузить файлы и заказать
                </Button>
              </DialogTrigger>
            </Dialog>
          </section>
        </main>
      ) : (
        /* Team Section */
        <main className="container mx-auto px-4 py-12">
          <section className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Наша команда</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Профессионалы с многолетним опытом в видеопродакшене
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="bg-card hover:bg-card/80 transition-all duration-300 hover:scale-105"
                >
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Icon name="User" size={32} className="text-primary" />
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">
                      Опыт работы:{" "}
                      <span className="font-semibold text-primary">
                        {member.experience}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* Order Modal */}
      <Dialog open={isOrderOpen} onOpenChange={setIsOrderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Заказать видеомонтаж
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label
                htmlFor="file-upload"
                className="text-base font-medium mb-3 block"
              >
                Загрузите ваши файлы (.mp4, .gif)
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".mp4,.gif,video/*"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Выбранные файлы:
                </Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted p-2 rounded"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label
                htmlFor="description"
                className="text-base font-medium mb-3 block"
              >
                Опишите ваш проект
              </Label>
              <Textarea
                id="description"
                placeholder="Расскажите, что вы хотите получить в результате..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setIsOrderOpen(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={handleOrderSubmit}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Отправить заказ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
