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
<p>Solltest du dich für einen Kombi-Tarif entschieden haben, so wirst du automatisch von uns in dem entsprechenden Kurs mit angelegt, ohne dass du etwas unternehmen musst.</p>

<p>Solltest du diese Anmeldung nicht vorgenommen haben, so melde dich bitte bei uns.
    Diese Mail bestätigt lediglich den Eingang deiner Anmeldung.
    Du wirst in den nächsten Tagen eine offizielle Bestätigung von uns erhalten.</p>

<p>Welcome to the Movement of Salsa,<br>
    Euer Movement-of-Salsa Team</p>
