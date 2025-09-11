import React from "react";

const TermsOfService = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Общи условия</h1>

      <div className="space-y-6 leading-relaxed text-gray-700">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            1. Общи разпоредби
          </h2>
          <p>
            Настоящите общи условия регулират ползването на уебсайта
            "Прегърната" и услугите, предлагани от нас. Използвайки нашия сайт,
            вие се съгласявате с тези условия.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            2. Описание на услугите
          </h2>
          <p>
            "Прегърната" предлага информация, подкрепа и събития свързани с
            бременността, раждането и майчинството, включително:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>Образователни програми и курсове</li>
            <li>Групови и индивидуални консултации</li>
            <li>Събития и работилници</li>
            <li>Информационни ресурси</li>
          </ul>

          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-medium text-gray-800">
              Технически стъпки за сключване на договор:
            </h3>
            <ol className="ml-6 list-decimal space-y-1 text-sm">
              <li>Избиране на услуга/събитие от уебсайта</li>
              <li>Попълване на регистрационна форма с лични данни</li>
              <li>Преглед и потвърждаване на поръчката</li>
              <li>Извършване на плащане</li>
              <li>Получаване на потвърждение по email</li>
              <li>Договорът влиза в сила след успешно плащане</li>
            </ol>
          </div>
        </section>
        <section>
          {/* Legal Company Information as required by Electronic Commerce Act */}
          <div className="mt-8 rounded-lg bg-gray-50 p-6">
            <h4 className="mb-4 text-lg font-semibold text-gray-800">
              Правна информация за организацията
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Пълно наименование:</strong> "Прегърната" ЕООД
              </p>

              <p>
                <strong>ЕИК:</strong>
              </p>
              <p>
                <strong>Регистрация:</strong> Търговски регистър при Агенция по
                вписванията
              </p>
              <p>
                <strong>Електронна поща:</strong> embraced.mothersclub@gmail.com
              </p>

              <p>
                <strong>Контролен орган:</strong> Комисия за защита на
                потребителите (КЗП)
              </p>
            </div>
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            3. Информация за цени и такси
          </h2>
          <p>
            Всички цени са посочени в български лева (лв.) и включват ДДС където
            е приложимо.
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>Цените са валидни към момента на поръчката</li>
            <li>Не се начисляват допълнителни такси освен посочените</li>
            <li>
              Плащането се извършва предварително чрез банков превод или онлайн
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            4. Право на отказ и промяна
          </h2>
          <div className="rounded-lg bg-amber-50 p-4">
            <h3 className="mb-2 font-medium text-gray-800">
              Условия за отказ от договора:
            </h3>
            <ul className="ml-6 list-disc space-y-1 text-sm">
              <li>
                Потребителят има право да се откаже от договора в срок от 14 дни
                без посочване на причини (съгласно ЗЗП)
              </li>
              <li>Срокът започва да тече от деня на сключване на договора</li>
              <li>
                За събития - отказът трябва да бъде направен най-малко 24 часа
                преди началото
              </li>
              <li>При отказ в законовия срок се възстановява пълната сума</li>
              <li>При отказ след този срок, таксата не се възстановява</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            5. Регистрация и акаунт
          </h2>
          <p>
            За някои услуги може да се изисква регистрация. Вие сте отговорни
            за:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>Предоставянето на точна и актуална информация</li>
            <li>Поддържането на сигурността на акаунта</li>
            <li>Незабавното уведомяване при компрометиране на акаунта</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            6. Права и задължения на страните
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-2 font-medium text-gray-800">
                Права на потребителя:
              </h3>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Получаване на качествени услуги</li>
                <li>Право на информация за услугата</li>
                <li>Право на отказ в законовия срок</li>
                <li>Защита на личните данни</li>
                <li>Право на жалба при неудовлетвореност</li>
              </ul>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-gray-800">
                Задължения на доставчика:
              </h3>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Предоставяне на услугите съгласно договора</li>
                <li>Спазване на обявените цени и условия</li>
                <li>Защита на личните данни</li>
                <li>Предоставяне на пълна информация</li>
                <li>Спазване на сроковете за възстановяване</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            7. Механизми за разрешаване на спорове
          </h2>
          <div className="space-y-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-medium text-gray-800">
                Стъпки за решаване на спорове:
              </h3>
              <ol className="ml-6 list-decimal space-y-1 text-sm">
                <li>
                  Директна комуникация с нашия екип:
                  embraced.mothersclub@gmail.com
                </li>
                <li>Писмена жалба до ръководството на организацията</li>
                <li>Обръщане към Комисията за защита на потребителите (КЗП)</li>
                <li>
                  Медиация чрез Центъра за извънсъдебно решаване на спорове
                </li>
                <li>
                  Съдебно производство пред компетентните български съдилища
                </li>
              </ol>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Забележка:</strong> Потребителите могат да се обърнат към
              КЗП за безплатна помощ при спорове.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            8. Съхранение и възпроизвеждане на договора
          </h2>
          <p>
            Потребителят може да съхрани и възпроизведе условията на договора по
            следните начини:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>Запазване на потвърдителния email</li>
            <li>Принтиране на тази страница с общите условия</li>
            <li>Запазване в PDF формат чрез браузъра</li>
            <li>
              Заявка за копие на договора на email:
              embraced.mothersclub@gmail.com
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            9. Използване на сайта
          </h2>
          <p>Вие се задължавате да:</p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>Използвате сайта в съответствие със закона</li>
            <li>Не разпространявате вредоносно съдържание</li>
            <li>Не нарушавате правата на други потребители</li>
            <li>Не използвате сайта за комерсиални цели без разрешение</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            10. Записване за събития
          </h2>
          <p>При записване за събития и курсове:</p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>Задължителни са точните лични данни</li>
            <li>Плащането се извършва предварително</li>
            <li>Отказването се прави най-малко 24 часа предварително</li>
            <li>При отказ след този срок, таксата не се възстановява</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            11. Плащания и възстановявания
          </h2>
          <p>
            Всички цени са в български лева и включват ДДС където е приложимо.
            Възстановяванията се извършват при спазване на условията за отказ.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            12. Медицински отказ от отговорност
          </h2>
          <p className="rounded border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <strong>Важно:</strong> Информацията на този сайт е с образователна
            цел и не заменя професионален медицински съвет. Винаги се
            консултирайте с лекар или акушерка за медицински въпроси.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            13. Авторски права
          </h2>
          <p>
            Всички материали на сайта са защитени от авторски права. Не е
            разрешено копирането, разпространението или използването за
            комерсиални цели без писмено разрешение.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            14. Ограничение на отговорността
          </h2>
          <p>
            "Прегърната" не носи отговорност за щети, произтичащи от
            използването на сайта или услугите, освен в случаите предвидени в
            закона.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            15. Приложимо право
          </h2>
          <p>
            Тези условия се регулират от българското законодателство. Спорове се
            решават от компетентните български съдилища.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            16. Контакт
          </h2>
          <div className="rounded-lg bg-gray-50 p-4">
            <p>За въпроси относно тези условия се обърнете към нас:</p>
            <div className="mt-2 space-y-1">
              <p>
                <strong>Email:</strong> embraced.mothersclub@gmail.com
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
