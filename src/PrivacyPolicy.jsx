import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Политика за поверителност
      </h1>

      <div className="space-y-6 leading-relaxed text-gray-700">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            1. Идентичност на администратора на данни
          </h2>
          <div className="rounded-lg bg-blue-50 p-4">
            <p>
              <strong>Наименование:</strong> "Прегърната" ЕООД
            </p>
            <p>
              <strong>Адрес:</strong> гр. Пловдив, ул. Пример 123
            </p>
            <p>
              <strong>ЕИК:</strong> 123456789
            </p>
            <p>
              <strong>E-Mail:</strong> embraced.mothersclub@gmail.com
            </p>

            <p className="mt-2 text-sm">
              <strong>Забележка:</strong> Не сме назначили длъжностно лице по
              защита на данните (DPO), тъй като не попадаме в задължителните
              случаи според GDPR.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            2. Цел и правно основание на обработката
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium text-gray-800">
                Записване за събития и курсове
              </h3>
              <p className="mt-1 text-sm">
                <strong>Правно основание:</strong> Чл. 6, ал. 1, б. "б" от GDPR
                (договорна необходимост)
              </p>
              <p className="text-sm">
                <strong>Цел:</strong> Изпълнение на договора за предоставяне на
                услуги
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium text-gray-800">
                Маркетингови комуникации
              </h3>
              <p className="mt-1 text-sm">
                <strong>Правно основание:</strong> Чл. 6, ал. 1, б. "а" от GDPR
                (съгласие)
              </p>
              <p className="text-sm">
                <strong>Цел:</strong> Изпращане на информация за нови събития и
                услуги
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium text-gray-800">
                Подобряване на услугите
              </h3>
              <p className="mt-1 text-sm">
                <strong>Правно основание:</strong> Чл. 6, ал. 1, б. "е" от GDPR
                (законен интерес)
              </p>
              <p className="text-sm">
                <strong>Цел:</strong> Анализ на потребностите и подобряване на
                качеството
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            3. Видове събирани данни
          </h2>
          <div className="space-y-3">
            <div className="rounded-lg bg-yellow-50 p-3">
              <h3 className="font-medium text-gray-800">
                Лични данни при регистрация:
              </h3>
              <ul className="ml-4 mt-1 list-disc space-y-1 text-sm">
                <li>Име и фамилия</li>
                <li>Електронна поща</li>
                <li>Телефонен номер</li>
                <li>Информация за бременността (срок, предишни бременности)</li>
                <li>Медицинска информация (по желание)</li>
              </ul>
            </div>

            <div className="rounded-lg bg-yellow-50 p-3">
              <h3 className="font-medium text-gray-800">Технически данни:</h3>
              <ul className="ml-4 mt-1 list-disc space-y-1 text-sm">
                <li>IP адрес</li>
                <li>Тип браузър и версия</li>
                <li>Операционна система</li>
                <li>Данни от бисквитки</li>
                <li>Статистика за използване на сайта</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            4. Срок на съхранение
          </h2>
          <div className="space-y-3">
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="font-medium text-gray-800">
                Принципи за съхранение:
              </h3>
              <ul className="ml-4 mt-2 list-disc space-y-1 text-sm">
                <li>
                  <strong>Договорни данни:</strong> 5 години след изпълнение на
                  договора (съгласно счетоводното законодателство)
                </li>
                <li>
                  <strong>Маркетингови данни:</strong> До оттегляне на
                  съгласието или 3 години без активност
                </li>
                <li>
                  <strong>Технически данни:</strong> До 2 години (статистически
                  цели)
                </li>
                <li>
                  <strong>Медицинска информация:</strong> 3 години или до заявка
                  за заличаване
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            5. Получатели на данните
          </h2>
          <p>Вашите лични данни могат да бъдат споделени с:</p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>
              <strong>Доставчици на технически услуги:</strong> Хостинг
              провайдери, системи за имейл маркетинг
            </li>
            <li>
              <strong>Счетоводни услуги:</strong> За издаване на фактури и
              счетоводно отчитане
            </li>
            <li>
              <strong>Компетентни органи:</strong> При законово изискване или
              съдебно разпореждане
            </li>
            <li>
              <strong>Партньори:</strong> Само с изрично съгласие за конкретни
              събития
            </li>
          </ul>
          <p className="mt-2 text-sm text-gray-600">
            <strong>Забележка:</strong> Всички трети страни са договорно
            задължени да спазват стандартите за защита на данни.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            6. Пълен списък с правата на субектите на данни
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="font-medium text-gray-800">
                Основни права според GDPR:
              </h3>
              <div className="mt-2 space-y-2 text-sm">
                <div>
                  <strong>Право на достъп (чл. 15):</strong> Можете да поискате
                  копие от всички лични данни, които обработваме за вас
                </div>
                <div>
                  <strong>Право на поправка (чл. 16):</strong> Можете да
                  поискате корекция на неточни или непълни данни
                </div>
                <div>
                  <strong>Право на заличаване (чл. 17):</strong> "Правото да
                  бъдете забравени" при определени условия
                </div>
                <div>
                  <strong>Право на ограничаване (чл. 18):</strong> Можете да
                  поискате временно спиране на обработката
                </div>
                <div>
                  <strong>Право на преносимост (чл. 20):</strong> Можете да
                  получите данните си в структуриран формат
                </div>
                <div>
                  <strong>Право на възражение (чл. 21):</strong> Можете да
                  възразите срещу обработката за маркетингови цели
                </div>
                <div>
                  <strong>
                    Права относно автоматизирано вземане на решения (чл. 22):
                  </strong>{" "}
                  Защита от решения, базирани само на автоматична обработка
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-amber-50 p-4">
              <h3 className="font-medium text-gray-800">
                Как да упражните правата си:
              </h3>
              <ul className="ml-4 mt-2 list-disc space-y-1 text-sm">
                <li>Изпратете заявка на embraced.mothersclub@gmail.com</li>
                <li>Обадете се на +359 XXX XXX XXX</li>
                <li>
                  Отговаряме в срок до 30 дни (може да бъде удължен до 60 дни
                  при сложни случаи)
                </li>
                <li>Заявките се разглеждат безплатно</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            7. Данни за връзка с КЗЛД
          </h2>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="mb-2">
              При нарушения на вашите права можете да подадете жалба до:
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Комисия за защита на личните данни (КЗЛД)</strong>
              </p>
              <p>
                <strong>Адрес:</strong> гр. София 1592, ул. "Проф. Фритьоф
                Нансен" 2
              </p>

              <p>
                <strong>Email:</strong> kzld@cpdp.bg
              </p>
              <p>
                <strong>Уебсайт:</strong> https://www.cpdp.bg
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            8. Сигурност
          </h2>
          <p>
            Прилагаме подходящи технически и организационни мерки за защита на
            личните данни срещу неоторизиран достъп, промяна, разкриване или
            унищожаване:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>SSL криптиране на всички данни в транзит</li>
            <li>Редовни backup копия и тестване на възстановяването</li>
            <li>Ограничен достъп само за упълномощени лица</li>
            <li>Редовно обучение на персонала по защита на данни</li>
            <li>Договори за защита на данни с всички доставчици</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            9. Бисквитки
          </h2>
          <p>
            Нашият уебсайт използва бисквитки за подобряване на потребителското
            изживяване. За подробна информация вижте нашата{" "}
            <a href="/cookie-policy" className="text-blue-600 underline">
              Политика за бисквитки
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            10. Контакт
          </h2>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="mb-2">
              За въпроси относно тази политика за поверителност или за
              упражняване на правата си, моля свържете се с нас на:
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Email за защита на данни:</strong>{" "}
                embraced.mothersclub@gmail.com
              </p>
              <p>
                <strong>Общ Email:</strong> embraced.mothersclub@gmail.com
              </p>


            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            11. Промени
          </h2>
          <p>
            Запазваме си правото да актуализираме тази политика за
            поверителност. Промените влизат в сила от момента на публикуването
            им на уебсайта.
          </p>

        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
