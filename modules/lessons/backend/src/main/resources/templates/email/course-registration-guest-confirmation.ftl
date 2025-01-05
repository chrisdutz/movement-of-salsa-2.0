Movement-of-Salsa Bestätigung des erhalts deiner Kursbuchung
<p>Vielen Dank für deine Kursanmeldung bei Movement-of-Salsa</p>

<p>Soeben haben wir von dir eine Buchung für einen unserer Kurse erhalten.</p>
<p>Kurs Bezeichnung : ${course.courseType.code} - ${course.courseType.title}<br/>
    Start Datum/Zeit: ${date.format('dd.MM.yyyy HH:mm', course.firstLesson.startTime)}</p>
<#if partner?has_content>
    <p>Partner: ${partner.lastName}, ${partner.firstName}</p>
</#if>
<#if registration.remarks?has_content>
<p>Bemerkungen: ${registration.remarks}</p>
</#if>

<p>Da du dich als Gast angemeldet hast, musst du deine Anmeldng noch bestätigen.></p>
<p>Klicke auf diesen <a href="${appBaseUrl}/mvc/validate-course-registration.html?course-id=${course.id}&email=${email}&token=${validationRequest.tokenCode}">Link</a></p>

<p>Welcome to the Movement of Salsa,<br>
    Euer Movement-of-Salsa Team</p>
