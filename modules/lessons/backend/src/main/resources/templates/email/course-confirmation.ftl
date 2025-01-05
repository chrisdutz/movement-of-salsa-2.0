Movement-of-Salsa Bestätigung deiner Kursbuchung
<p>Hallo ${user.firstName},</p>

<p>Wir freuen uns hiermit deine Kursbuchung bestätigen zu können.</p>

<p>Kurs Bezeichnung : ${course.courseType.code} - ${course.courseType.title}<br/>
    Start Datum/Zeit: ${date.format('dd.MM.yyyy HH:mm', course.firstLesson.startTime)}</p>

<#if userRegistration?has_content>
    <#if userRegistration.registrar == user && !userRegistration.partner?has_content>
    Du hast dich als Single zu diesem Kurs angemeldet. Wir haben für dich <b>${partner.firstName} ${partner.lastName}</b> als Partner ausgesucht.<br/>
    Wir bitten dich die Kursgebühr in höhe von <b>${priceToPay}€</b> zum ersten Kurstermin mitzubringen.
    <#elseif userRegistration.registrar == user && userRegistration.partner == partner>
    Du hast dich zu diesem Kurs zusammen mit deinem Partner <b>${partner.firstName} ${partner.lastName}</b> angemeldet.<br/>
    Wir bitten dich die Kursgebühr in höhe von <b>${priceToPay}€</b> zum ersten Kurstermin mitzubringen.<br/>
    Wenn ihr euch die Kursgebühr teilt, so wäre dies <b>${(priceToPay) / 2}€</b> pro Person.
    <#elseif userRegistration.registrar == user && userRegistration.partner != partner>
    Du hast dich zwar zu diesem Kurs zusammen mit <b>${userRegistration.partner.firstName} ${userRegistration.partner.lastName}</b> angemeldet, allerdings wirst du in diesem Kurs mit <b>${partner.firstName} ${partner.lastName}</b> tanzen.<br/>
    Wir bitten dich die Kursgebühr in höhe von <b>${priceToPay}€</b> zum ersten Kurstermin mitzubringen.<br/>
    Wenn ihr euch die Kursgebühr teilt, so wäre dies <b>${(priceToPay) / 2}€</b> pro Person.
    <#elseif userRegistration.partner == user && userRegistration.registrar == partner>
    Du wurdest von <b>${partner.firstName} ${partner.lastName}</b> zu diesem Kurs angemeldet. Dieser wird auch dein Partner für diesen Kurs sein.<br/>
    Wenn ihr euch die Kursgebühr teilt, so wäre dies <b>${(priceToPay) / 2}€</b> pro Person, welche beim ersten Termin zu bezahlen sind.
    <#elseif userRegistration.partner == user && userRegistration.registrar != partner>
    Du wurdest von <b>${userRegistration.partner.firstName} ${userRegistration.partner.lastName}</b> zu diesem Kurs angemeldet, allerdings haben wir ${partner.firstName} ${partner.lastName} ausgesucht.<br/>
    Wenn ihr euch die Kursgebühr teilt, so wäre dies <b>${(priceToPay) / 2}€</b> pro Person, welche beim ersten Termin zu bezahlen sind.</br>
    </#if>
    <#if userRegistration.discount?has_content>
    In diesem Preis ist ein Rabatt in höhe von <b>${userRegistration.discount}€</b> eingerechnet. <#if userRegistration.discountRemarks?has_content> (${userRegistration.discountRemarks})</#if>
    </#if>
<#else>
    Du bist für diesen Kurs als Gast für ${partner.firstName} ${partner.lastName} angemeldet worden.
</#if>

<p>Welcome to the Movement of Salsa,<br>
    Euer Movement-of-Salsa Team</p>
