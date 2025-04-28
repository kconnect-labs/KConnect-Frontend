import React from 'react';
import { Typography, Container, Paper, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';

const TermsOfServicePage = () => {
  return (
    <div className="terms-of-service-page">
      <Header title="Условия использования" backButton />
      
      <Container maxWidth="md" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link to="/rules" style={{ textDecoration: 'none', color: '#666' }}>
            Правила сообщества
          </Link>
          <Link to="/privacy-policy" style={{ textDecoration: 'none', color: '#666' }}>
            Политика конфиденциальности
          </Link>
          <Link to="/terms-of-service" style={{ textDecoration: 'none', color: '#8c52ff', fontWeight: 'bold' }}>
            Условия использования
          </Link>
        </div>
        
        <Paper style={{ padding: '24px' }}>
          <Typography variant="h5" style={{ marginBottom: '8px', fontWeight: 'bold', color: '#8c52ff' }}>
            Условия использования К-Коннект
          </Typography>
          
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: '16px' }}>
            Последнее обновление: {new Date().toLocaleDateString()}
          </Typography>
          
          <Divider style={{ margin: '16px 0' }} />
          
          <Typography variant="body1" paragraph>
            Добро пожаловать в К-Коннект. Пожалуйста, внимательно прочитайте эти условия использования перед 
            регистрацией аккаунта и использованием нашего сервиса. Регистрируясь или используя К-Коннект, 
            вы соглашаетесь соблюдать эти условия.
          </Typography>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            1. Принятие условий
          </Typography>
          
          <Typography variant="body1" paragraph>
            Используя К-Коннект, вы соглашаетесь с настоящими Условиями использования, нашей Политикой конфиденциальности, Правилами сообщества и другими политиками, которые могут быть опубликованы на платформе. Если вы не согласны с любым из этих условий, пожалуйста, не используйте наш сервис.
          </Typography>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            2. Регистрация и безопасность аккаунта
          </Typography>
          
          <Typography variant="body1" paragraph>
            Для использования всех функций К-Коннект вам нужно создать аккаунт. Вы соглашаетесь:
          </Typography>
          
          <ul>
            <li>
              <Typography variant="body1">
                Предоставлять точную и актуальную информацию во время регистрации.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Сохранять конфиденциальность своего пароля и немедленно уведомлять нас о любом несанкционированном использовании вашего аккаунта.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Нести ответственность за все действия, происходящие под вашим аккаунтом.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Не создавать несколько аккаунтов без явного разрешения администрации.
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            3. Правила контента
          </Typography>
          
          <Typography variant="body1" paragraph>
            Вы несете полную ответственность за контент, который публикуете на К-Коннект. Вы обязуетесь не публиковать и не распространять:
          </Typography>
          
          <ul>
            <li>
              <Typography variant="body1">
                Контент, нарушающий чьи-либо права, включая права интеллектуальной собственности.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Незаконный, оскорбительный, дискриминационный, угрожающий или враждебный контент.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Спам, фишинг, вредоносное ПО и другие формы нежелательного контента.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Личную информацию других лиц без их согласия.
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            4. Интеллектуальная собственность
          </Typography>
          
          <Typography variant="body1" paragraph>
            К-Коннект и весь контент, представленный на платформе, защищены авторским правом и другими законами об интеллектуальной собственности. Публикуя контент, вы сохраняете все права на него, но предоставляете К-Коннект неисключительную, бесплатную лицензию на использование, воспроизведение, модификацию и отображение этого контента в связи с нашими услугами.
          </Typography>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            5. Использование сервиса
          </Typography>
          
          <Typography variant="body1" paragraph>
            Вы соглашаетесь:
          </Typography>
          
          <ul>
            <li>
              <Typography variant="body1">
                Использовать сервис только для законных целей и в соответствии с действующим законодательством.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Не пытаться получить несанкционированный доступ к любой части сервиса.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Не использовать автоматизированные скрипты или боты без нашего разрешения.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Не нарушать работу сервиса или сетей, связанных с сервисом.
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            6. Отказ от ответственности
          </Typography>
          
          <Typography variant="body1" paragraph>
            К-Коннект не несет ответственности за:
          </Typography>
          
          <ul>
            <li>
              <Typography variant="body1">
                Любые прямые, косвенные, случайные или штрафные убытки.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Любые действия или контент, опубликованный третьими лицами.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Перебои в работе сервиса или потерю данных.
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            7. Прекращение использования
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы имеем право:
          </Typography>
          
          <ul>
            <li>
              <Typography variant="body1">
                Приостановить или удалить ваш аккаунт, если вы нарушаете наши условия.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Удалить любой контент, нарушающий наши правила.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Прекратить предоставление сервиса или его частей по нашему усмотрению с предварительным уведомлением.
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            8. Изменения условий
          </Typography>
          
          <Typography variant="body1" paragraph>
            Мы можем изменять эти условия время от времени. Мы уведомим вас о существенных изменениях через сервис К-Коннект. Продолжая использовать сервис после таких изменений, вы соглашаетесь с новыми условиями.
          </Typography>
          
          <Typography variant="h6" style={{ marginTop: '24px', fontWeight: 'bold' }}>
            9. Применимое право
          </Typography>
          
          <Typography variant="body1" paragraph>
            Настоящие условия регулируются и толкуются в соответствии с законодательством Российской Федерации, без учета принципов коллизионного права.
          </Typography>
          
          <Typography variant="body1" style={{ marginTop: '32px', fontStyle: 'italic' }}>
            Используя К-Коннект, вы подтверждаете, что прочитали, поняли и соглашаетесь с этими Условиями использования.
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default TermsOfServicePage;