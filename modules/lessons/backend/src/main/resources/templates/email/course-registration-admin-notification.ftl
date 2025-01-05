Neue Kursbuchung Eingegangen
<p>Soeben ist eine Buchung für einen unserer Kurse eingegangen.</p>
<p>Von: ${registrar.lastName}, ${registrar.firstName}</p>
<#if partner?has_content>
<p>Mit Partner: ${partner.lastName}, ${partner.firstName}</p>
</#if>
<p>
    Kurs Bezeichnung : ${course.courseType.code} - ${course.courseType.title}<br/>
    Start Datum/Zeit: ${date.format('dd.MM.yyyy HH:mm', course.firstLesson.startTime)}<br/>
</p>
<#if registration.remarks?has_content>
<p>Bemerkungen: ${registration.remarks}</p>
</#if>
