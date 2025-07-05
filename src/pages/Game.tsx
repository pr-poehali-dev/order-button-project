import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const Game = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    player: THREE.Object3D;
    enemies: THREE.Mesh[];
    bullets: THREE.Mesh[];
    keys: { [key: string]: boolean };
    mouse: { x: number; y: number };
    health: number;
    score: number;
    gameRunning: boolean;
    clock: THREE.Clock;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Инициализация сцены
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    scene.fog = new THREE.Fog(0x111111, 10, 100);

    // Камера
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 1.6, 0);

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Освещение
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Создание пола
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Создание стен
    const wallGeometry = new THREE.BoxGeometry(2, 4, 2);
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });

    for (let i = 0; i < 20; i++) {
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(
        (Math.random() - 0.5) * 80,
        2,
        (Math.random() - 0.5) * 80,
      );
      wall.castShadow = true;
      wall.receiveShadow = true;
      scene.add(wall);
    }

    // Игровые объекты
    const player = new THREE.Object3D();
    player.add(camera);
    scene.add(player);

    const enemies: THREE.Mesh[] = [];
    const bullets: THREE.Mesh[] = [];
    const keys: { [key: string]: boolean } = {};
    const mouse = { x: 0, y: 0 };

    // Создание врагов
    const createEnemy = () => {
      const enemyGeometry = new THREE.BoxGeometry(1, 2, 1);
      const enemyMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
      const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);

      enemy.position.set(
        (Math.random() - 0.5) * 60,
        1,
        (Math.random() - 0.5) * 60,
      );
      enemy.castShadow = true;
      enemy.userData = { health: 100, speed: 0.02 };

      scene.add(enemy);
      enemies.push(enemy);
    };

    // Создание начальных врагов
    for (let i = 0; i < 10; i++) {
      createEnemy();
    }

    // Создание пули
    const createBullet = (
      position: THREE.Vector3,
      direction: THREE.Vector3,
    ) => {
      const bulletGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

      bullet.position.copy(position);
      bullet.userData = {
        velocity: direction.clone().multiplyScalar(2),
        life: 100,
      };

      scene.add(bullet);
      bullets.push(bullet);
    };

    // Прицел
    const crosshair = document.createElement("div");
    crosshair.style.position = "fixed";
    crosshair.style.top = "50%";
    crosshair.style.left = "50%";
    crosshair.style.transform = "translate(-50%, -50%)";
    crosshair.style.width = "20px";
    crosshair.style.height = "20px";
    crosshair.style.border = "2px solid #fff";
    crosshair.style.borderRadius = "50%";
    crosshair.style.pointerEvents = "none";
    crosshair.style.zIndex = "1000";
    document.body.appendChild(crosshair);

    // HUD
    const hudElement = document.createElement("div");
    hudElement.style.position = "fixed";
    hudElement.style.top = "20px";
    hudElement.style.left = "20px";
    hudElement.style.color = "#fff";
    hudElement.style.fontFamily = "Arial, sans-serif";
    hudElement.style.fontSize = "18px";
    hudElement.style.zIndex = "1000";
    document.body.appendChild(hudElement);

    const gameState = {
      scene,
      camera,
      renderer,
      player,
      enemies,
      bullets,
      keys,
      mouse,
      health: 100,
      score: 0,
      gameRunning: true,
      clock: new THREE.Clock(),
    };

    gameRef.current = gameState;

    // Обработчики событий
    const handleKeyDown = (event: KeyboardEvent) => {
      keys[event.key.toLowerCase()] = true;

      if (event.key === " ") {
        event.preventDefault();
        // Стрельба
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(camera.quaternion);
        createBullet(camera.position.clone(), direction);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys[event.key.toLowerCase()] = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Поворот камеры
      camera.rotation.y -= event.movementX * 0.002;
      camera.rotation.x -= event.movementY * 0.002;
      camera.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x),
      );
    };

    const handleClick = () => {
      // Захват указателя мыши
      renderer.domElement.requestPointerLock();
    };

    // Игровой цикл
    const gameLoop = () => {
      if (!gameState.gameRunning) return;

      const deltaTime = gameState.clock.getDelta();

      // Движение игрока
      const moveVector = new THREE.Vector3();
      if (keys["w"]) moveVector.z -= 1;
      if (keys["s"]) moveVector.z += 1;
      if (keys["a"]) moveVector.x -= 1;
      if (keys["d"]) moveVector.x += 1;

      if (moveVector.length() > 0) {
        moveVector.normalize();
        moveVector.multiplyScalar(0.1);
        moveVector.applyQuaternion(camera.quaternion);
        player.position.add(moveVector);
      }

      // Обновление пуль
      bullets.forEach((bullet, index) => {
        bullet.position.add(bullet.userData.velocity);
        bullet.userData.life--;

        if (bullet.userData.life <= 0) {
          scene.remove(bullet);
          bullets.splice(index, 1);
        }
      });

      // Обновление врагов
      enemies.forEach((enemy, enemyIndex) => {
        // Движение врага к игроку
        const direction = new THREE.Vector3();
        direction.subVectors(player.position, enemy.position);
        direction.normalize();
        direction.multiplyScalar(enemy.userData.speed);
        enemy.position.add(direction);

        // Проверка столкновения с пулями
        bullets.forEach((bullet, bulletIndex) => {
          const distance = enemy.position.distanceTo(bullet.position);
          if (distance < 0.5) {
            enemy.userData.health -= 25;
            scene.remove(bullet);
            bullets.splice(bulletIndex, 1);

            if (enemy.userData.health <= 0) {
              scene.remove(enemy);
              enemies.splice(enemyIndex, 1);
              gameState.score += 10;

              // Создание нового врага
              createEnemy();
            }
          }
        });

        // Проверка столкновения с игроком
        const playerDistance = enemy.position.distanceTo(player.position);
        if (playerDistance < 1.5) {
          gameState.health -= 0.5;
          if (gameState.health <= 0) {
            gameState.gameRunning = false;
            alert(`Игра окончена! Счет: ${gameState.score}`);
          }
        }
      });

      // Обновление HUD
      hudElement.innerHTML = `
        <div>Здоровье: ${Math.max(0, Math.floor(gameState.health))}%</div>
        <div>Счет: ${gameState.score}</div>
        <div>Враги: ${enemies.length}</div>
        <div style="margin-top: 10px; font-size: 14px;">
          WASD - движение<br>
          Мышь - взгляд<br>
          Пробел - стрельба<br>
          Клик - захват курсора
        </div>
      `;

      renderer.render(scene, camera);
      requestAnimationFrame(gameLoop);
    };

    // Обработка изменения размера окна
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Добавление обработчиков событий
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    // Запуск игры
    gameLoop();

    // Очистка при размонтировании
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      document.body.removeChild(crosshair);
      document.body.removeChild(hudElement);

      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />

      {/* Меню паузы */}
      <div className="absolute top-4 right-4 z-50">
        <Card className="bg-black/80 text-white border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="Target" size={20} />
              3D Шутер
            </CardTitle>
            <CardDescription className="text-gray-300">
              Выживи как можно дольше!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-sm space-y-1">
              <div>🎯 Цель: Уничтожай врагов</div>
              <div>❤️ Не дай им приблизиться</div>
              <div>🏆 Набирай очки</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Инструкции */}
      <div className="absolute bottom-4 left-4 z-50">
        <Card className="bg-black/80 text-white border-primary/50">
          <CardContent className="p-4">
            <div className="text-sm space-y-1">
              <div>
                <strong>WASD</strong> - Движение
              </div>
              <div>
                <strong>Мышь</strong> - Взгляд
              </div>
              <div>
                <strong>Пробел</strong> - Стрельба
              </div>
              <div>
                <strong>Клик</strong> - Захват курсора
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Game;
