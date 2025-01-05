Movement-of-Salsa Benachrichtigung einer Kursbuchung mit dir als Partner
<p>Es ist eine Kursanmeldung für dich bei Movement-of-Salsa eingegangen</p>

<p>Soeben haben wir von ${registrar.lastName}, ${registrar.firstName} eine Buchung für einen unserer Kurse erhalten, bei dem du als Tanzpartner angegeben worden bist.</p>
<p>Kurs Bezeichnung : ${course.courseType.code} - ${course.courseType.title}<br/>
    Start Datum/Zeit: ${date.format('dd.MM.yyyy HH:mm', course.firstLesson.startTime)}</p>
<#if registration.remarks?has_content>
<p>Bemerkungen: ${registration.remarks}</p>
</#if>

<p>Solltest du dieser Anmeldung nicht zustimmen, so melde dich bitte bei uns.</p>

<p>Welcome to the Movement of Salsa,<br>
    Euer Movement-of-Salsa Team</p>
