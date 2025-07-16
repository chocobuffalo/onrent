export default function CustomerRights() {
  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 divide-y divide-gray-200">
        {/* Título principal */}
        <div className="pb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Derechos del Cliente según el Reglamento General de Protección de Datos (GDPR)
          </h1>
          <p className="text-gray-700 text-center">
            Conoce cómo protegemos tu información y qué derechos tienes como usuario de OnRentX.
          </p>
        </div>

        {/* Secciones divididas */}
        <div className="pt-6 space-y-8 text-gray-700 text-sm leading-relaxed">
          {/* Política */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Política de Privacidad y Derechos GDPR</h2>
            <p>
              En <strong>OnRentX</strong>, respetamos y protegemos la privacidad de nuestros usuarios. Esta política explica cómo recopilamos, utilizamos y protegemos la información personal de nuestros visitantes y clientes, en cumplimiento con el GDPR y otras leyes aplicables.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">1. Responsable del Tratamiento de Datos</h3>
            <ul className="list-disc list-inside mt-2">
              <li>Nombre comercial: OnRentX</li>
              <li>Correo de contacto: contacto@onrentx.com</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">2. Información que Recopilamos</h3>
            <ul className="list-disc list-inside mt-2">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Dirección IP</li>
              <li>Datos de navegación mediante cookies</li>
              <li>Información relacionada con el alquiler y publicación de maquinaria</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">3. Finalidades del Tratamiento</h3>
            <ul className="list-disc list-inside mt-2">
              <li>Gestionar cuentas y perfiles de usuario</li>
              <li>Coordinar procesos de renta de maquinaria</li>
              <li>Comunicar promociones o actualizaciones de la plataforma</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">4. Derechos del Usuario (GDPR)</h3>
            <ul className="list-disc list-inside mt-2">
              <li>Acceder a tus datos personales</li>
              <li>Rectificar información incorrecta</li>
              <li>Solicitar la eliminación de tus datos (“derecho al olvido”)</li>
              <li>Oponerte al tratamiento de tus datos</li>
              <li>Portar tus datos a otro proveedor</li>
            </ul>
            <p className="mt-2">
              Para ejercer tus derechos, envía un correo a <strong>contacto@onrentx.com</strong> indicando tu solicitud.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">5. Uso de Cookies</h3>
            <p className="mt-2">
              Este sitio utiliza cookies para mejorar la experiencia de navegación. Puedes aceptar, rechazar o configurar las cookies desde tu navegador.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">6. Seguridad de la Información</h3>
            <p className="mt-2">
              Aplicamos medidas técnicas y organizativas para proteger tu información personal frente a accesos no autorizados, pérdida o uso indebido.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">7. Cambios en esta Política</h3>
            <p className="mt-2">
              Nos reservamos el derecho de modificar esta política en cualquier momento. Cualquier cambio será publicado en esta misma página.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              ¿Cómo solicitar la eliminación de tus datos y cuenta?
            </h3>
            <ol className="list-decimal list-inside mt-2 ml-4 space-y-1">
              <li>Redacta un correo con el asunto: <strong>Solicitud de eliminación de cuenta y datos personales</strong>.</li>
              <li>Incluye tu nombre completo y el correo electrónico registrado en OnRentX.</li>
              <li>Opcionalmente, puedes incluir una breve razón de la solicitud.</li>
              <li>Envía el correo a: <strong>soporte@onrentx.com</strong></li>
            </ol>
            <p className="mt-2">
              Nuestro equipo de soporte te responderá en un plazo máximo de 7 días hábiles.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Última actualización: 30 de abril de 2025
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
