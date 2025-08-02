export default function TerminosYCondiciones() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-xl font-bold text-center mb-2">
        Derechos de los usuarios según
        <br />
        El reglamento general de protección de datos (GDPR)
      </h1>

      <p className="text-sm text-center mb-6">
        De acuerdo con el Reglamento General de Protección de Datos (Reglamento
        UE 2016/679), usted tiene los siguientes derechos con respecto al
        tratamiento de sus datos personales.
      </p>

      <p className="text-sm mb-6">
        En OnRentX, respetamos y protegemos la privacidad de nuestros usuarios.
        Esta política explica cómo recopilamos, utilizamos y protegemos la
        información personal de nuestros visitantes y clientes, en cumplimiento
        con el Reglamento General de Protección de Datos (GDPR) y otras leyes
        aplicables.
      </p>

      <div className="space-y-6 text-sm leading-6">
        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-semibold mb-1">
            1. Responsable del Tratamiento de Datos
          </h2>
          <p>Nombre comercial: OnRentX</p>
          <p>Correo de contacto: contacto@onrentx.com</p>
        </div>

        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-semibold mb-1">2. Información que Recopilamos</h2>
          <p>Podemos recopilar los siguientes datos personales:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Nombre completo</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Dirección IP</li>
            <li>Datos de navegación mediante cookies</li>
            <li>
              Información relacionada con el alquiler y publicación de
              maquinaria
            </li>
          </ul>
        </div>

        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-semibold mb-1">3. Finalidades del Tratamiento</h2>
          <p>Utilizamos los datos personales para:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Gestionar cuentas y perfiles de usuario</li>
            <li>Coordinar procesos de alquiler de maquinaria</li>
            <li>Comunicar promociones o actualizaciones de la plataforma</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </div>

        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-semibold mb-1">4. Derechos del Usuario (GDPR)</h2>
          <p>Tienes derecho a:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Acceder a tus datos personales</li>
            <li>Rectificar información incorrecta</li>
            {/* <li>Solicitar la eliminación de tus datos ("derecho al olvido")</li> */}

            <li>
              Solicitar la eliminación de tus datos ( &quot;derecho al
              olvido&quot;)
            </li>

            <li>Oponerte al tratamiento de tus datos</li>
            <li>Portar tus datos a otro proveedor</li>
          </ul>
          <p>
            Para ejercer tus derechos, envía un correo a{" "}
            <strong>contacto@onrentx.com</strong> indicando tu solicitud.
          </p>
        </div>

        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-semibold mb-1">5. Uso de cookies</h2>
          <p>
            Este sitio utiliza cookies para mejorar la experiencia de
            navegación. Puedes aceptar, rechazar o configurar las cookies desde
            tu navegador.
          </p>
        </div>

        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-semibold mb-1">6. Seguridad de la Información</h2>
          <p>
            Aplicamos medidas técnicas y organizativas para proteger tu
            información personal frente a accesos no autorizados, pérdida o uso
            indebido.
          </p>
        </div>

        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-semibold mb-1">7. Cambios en esta política</h2>
          <p>
            Nos reservamos el derecho de modificar esta política en cualquier
            momento. Cualquier cambio será publicado en esta misma página.
          </p>
        </div>

        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-semibold mb-1">
            ¿Cómo solicitar la eliminación de tus datos y cuenta?
          </h2>
          <p>
            Si deseas que tu cuenta y todos tus datos personales sean eliminados
            de nuestra plataforma, sigue estos pasos:
          </p>
          <ul className="list-decimal list-inside ml-4">
            <li>
              Redacta un correo con el asunto:{" "}
              <strong>
                Solicitud de eliminación de cuenta y datos personales
              </strong>
              .
            </li>
            <li>
              Incluye tu nombre completo y el correo electrónico con el que
              estás registrado en OnRentX.
            </li>
            <li>
              (Opcionalmente) puedes escribir una breve razón de tu solicitud.
            </li>
            <li>Envía el correo a: soporte@onrentx.com</li>
          </ul>
          <p>
            El equipo de soporte responderá en un plazo máximo de 7 días hábiles
            para confirmar la eliminación de tus datos.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Última actualización: 30 de abril de 2025
          </p>
        </div>
      </div>
    </div>
  );
}
