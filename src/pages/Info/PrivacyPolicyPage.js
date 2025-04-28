import React from 'react';
import { Typography, Container, Paper, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy-page">
      <Header title="Политика конфиденциальности" backButton />
      
      <Container maxWidth="md" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link to="/rules" style={{ textDecoration: 'none', color: '#666' }}>
            Правила сообщества
          </Link>
          <Link to="/privacy-policy" style={{ textDecoration: 'none', color: '#8c52ff', fontWeight: 'bold' }}>
            Политика конфиденциальности
          </Link>
          <Link to="/terms-of-service" style={{ textDecoration: 'none', color: '#666' }}>
            Условия использования
          </Link>
        </div>
        
        <Paper style={{ padding: '24px' }}>
          <Typography variant="h5" style={{ marginBottom: '8px', fontWeight: 'bold', color: '#8c52ff' }}>
            Политика конфиденциальности К-Коннект
          </Typography>
          
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: '16px' }}>
            Последнее обновление: {new Date().toLocaleDateString()}
          </Typography>
          
          <Divider style={{ margin: '16px 0' }} />
          
          <Typography variant="body1" paragraph>
            Мы, команда К-Коннект, серьезно относимся к безопасности ваших личных данных. 
            Эта политика конфиденциальности описывает, какую информацию мы собираем и как мы ее используем.
          </Typography>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            1. Какую информацию мы собираем
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы собираем следующие типы информации:
          </Typography>
          
          <ul>
            <li>
              <Typography variant="body1">
                <strong>Информация аккаунта:</strong> имя, имя пользователя (username), адрес электронной почты, фотография профиля, информация о себе.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Данные профиля:</strong> интересы, социальные ссылки, данные, которые вы решите указать в вашем профиле.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Контент:</strong> посты, комментарии, лайки, музыка и медиа, которые вы публикуете.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Технические данные:</strong> IP-адрес, данные браузера, время доступа, данные устройства.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Данные взаимодействия:</strong> подписки, взаимодействия с другими пользователями, настройки уведомлений.
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            2. Как мы используем вашу информацию
          </Typography>
          
          <Typography variant="body1" paragraph>
            Ваша информация используется для:
          </Typography>
          
          <ul>
            <li>
              <Typography variant="body1">
                Обеспечения функционирования платформы и предоставления вам доступа к ее функциям.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Улучшения, персонализации и развития нашего сервиса.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Коммуникации с вами, включая отправку уведомлений, обновлений и технической информации.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Обеспечения безопасности и защиты сервиса от мошенничества и злоупотреблений.
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            3. Как мы делимся вашей информацией
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы не продаем ваши данные третьим лицам. Мы можем делиться информацией в следующих случаях:
          </Typography>
          
          <ul>
            <li>
              <Typography variant="body1">
                С вашего явного согласия.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Для выполнения требований законодательства.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                С поставщиками услуг, которые помогают нам управлять сервисом (хостинг, аналитика и т.д.).
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            4. Безопасность ваших данных
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы внедряем необходимые технические и организационные меры для защиты ваших данных, включая:
          </Typography>
          
          <ul>
            <li>
              <Typography variant="body1">
                Шифрование передаваемых данных.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Хранение паролей в защищенной форме.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Регулярные обновления безопасности системы.
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            5. Ваши права
          </Typography>
          
          <Typography variant="body1" paragraph>
            В зависимости от вашего местоположения, вы можете иметь следующие права:
          </Typography>
          
          <ul>
            <li>
              <Typography variant="body1">
                Доступ к вашим персональным данным.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Исправление неточной или неполной информации.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Удаление ваших персональных данных.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Ограничение обработки ваших данных.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Получение ваших данных в структурированном, машиночитаемом формате.
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            6. Файлы Cookie и подобные технологии
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы используем файлы cookie и подобные технологии для улучшения работы сервиса, анализа использования и персонализации. Вы можете управлять настройками файлов cookie через ваш браузер.
          </Typography>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            7. Изменения в политике конфиденциальности
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы можем обновлять нашу политику конфиденциальности время от времени. Мы уведомим вас о любых существенных изменениях через сервис К-Коннект или по электронной почте.
          </Typography>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            8. Контактная информация
          </Typography>
          
          <Typography variant="body1" paragraph>
            Если у вас есть вопросы, связанные с этой политикой или с обработкой ваших данных, пожалуйста, свяжитесь с нами через форму обратной связи в приложении или отправьте сообщение через раздел "Баг-репорты".
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default PrivacyPolicyPage; 