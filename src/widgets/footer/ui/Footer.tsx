import { Link } from 'react-router-dom'

import { routes, SERVICE_NAME } from '@/shared/config'
import { Container } from '@/shared/ui'

import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <span className={styles.name}>{SERVICE_NAME}</span>
            <p>
              Мониторинг эпизоотической ситуации в регионах России для фермеров. Справочный характер: решения о
              карантине принимает государственная ветеринарная служба.
            </p>
          </div>
          <div>
            <p className={styles.title}>Сервис</p>
            <ul className={styles.list}>
              <li>
                <Link to={routes.map()}>Карта регионов</Link>
              </li>
              <li>
                <Link to={routes.farm()}>Моё хозяйство</Link>
              </li>
              <li>
                <Link to={routes.feed()}>Лента событий</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className={styles.title}>Инструменты</p>
            <ul className={styles.list}>
              <li>
                <Link to={routes.routeCheck()}>Проверка перед перевозкой</Link>
              </li>
              <li>
                <Link to={routes.diseases()}>Справочник болезней</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>
            Данные: оперативные сводки ИАЦ Управления ветнадзора (ФГБУ «ВНИИЗЖ») на сайте Россельхознадзора,
            региональные ветслужбы и СМИ.
          </p>
          <p>Проект для стипендиального конкурса РСХБ.Цифра, 2026. Не является официальным сервисом банка.</p>
        </div>
      </Container>
    </footer>
  )
}
