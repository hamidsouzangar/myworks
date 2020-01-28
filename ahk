#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.
;----------------------------------------------------------------
#IfWinActive MATLAB R2014a

0::
send, )
Return

9::
send, (
Return

#IfWinActive
;-------------------------------------------------------------------
;-----------------------------------------------------------------anki
#If WinActive("Add") or WinActive("Edit Current") or WinActive("Browser")

:*:7::{home}•{Space}  
:*:8::{home}◘{Space}
:*:1::;
:*:9::{home}▐SYNs▌
!v::
send, {home}▐Verb▌
Return

!n::
send, {home}▐N▌
Return

!a::
send, {home}▐Adj▌
Return

!d::
send,{home}▐Adv▌
Return 

F3::☼

4::
send, ^{home}
sleep, 200 ;(wait 0.2 seconds)
send, {backspace}
sleep, 200 ;(wait 0.2 seconds)
send, ▐▐
sleep, 200 ;(wait 0.2 seconds)
send, {enter}
Return

2::
send, {Enter}
send, {ctrl down}{r}{ctrl up}
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{b}{ctrl up}
sleep, 200 ;(wait 0.2 seconds)
send,  SYN:{space}
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{b}{ctrl up}
Return

1::
send, {ctrl down}{r}{ctrl up}
Return

XButton2::
send, {Tab} ;Tab
Return

XButton1::  ;بک موس + صدا دار کردن کلمه در انکی
	
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
send, {SC14F} ; "END Key"
send, {ctrl down}{t}{ctrl up}
sleep, 400 ;(wait 0.4 seconds)
send, {ctrl down}{v}{ctrl up}
Return

5:: ; نامبر 5 ، صدا دار کردن انکی 

send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
sleep, 200 ;(wait 0.2 seconds)
send, {SC14F} ; "END Key"
send, {ctrl down}{t}{ctrl up}
sleep, 400 ;(wait 0.4 seconds)
send, {ctrl down}{v}{ctrl up}
Return



-::  ; نامبر -  خط چین در انکی 
send, ^c
sleep, 200 ;(wait 0.2 seconds)
send, -------- 
send, {Space}
Return

=::   ; نامبر + کپی کردن در تب بعدی  انکی 
sleep, 400 ;(wait 0.2 seconds)
send, ^c
sleep, 200 ;(wait 0.2 seconds)
send, {Tab}  ;tab
send, ^v
send, {Space}
sleep, 200 ;(wait 0.2 seconds)
send, {Tab} ;tab
Return

3:: ; نامبر 3 جای خالی و صدا دار کردن جواب  
send, {Tab} ;tab
sleep, 100 ;(wait 0.2 seconds)
send, {ctrl down}{v}{ctrl up}
sleep, 200 ;(wait 0.2 seconds)
send, {Tab} ;tab
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{t}{ctrl up}
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{v}{ctrl up}
sleep, 200 ;(wait 0.1 seconds)
send, {LButton}
sleep, 400 ;(wait 0.1 seconds)
send, {Tab} ;tab


#IfWinActive
;--------------------------------------------------------------------
#If WinActive("Edit Current") or WinActive("Browser") or WinActive("Add")

F2::  ; در انکی سرپچ دیکشنری 
	clipboard = ; Empty the clipboard
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
Return

XButton1:: ; صدا دار کردن کلمه در انکی 
send, {ctrl down}{t}{ctrl up}
Return

:*:7::• 
:*:8::◘ 


-::  ; نامبر -  خط چین در انکی 
send, ^c
sleep, 200 ;(wait 0.2 seconds)
send, -------- 
Return

=::   ; نامبر + کپی کردن در تب بعدی  انکی 
sleep, 400 ;(wait 0.2 seconds)
send, ^c
sleep, 200 ;(wait 0.2 seconds)
send, {Tab}  ;tab
send, ^v
send, {Space}
sleep, 200 ;(wait 0.2 seconds)
send, {Tab} ;tab
Return

#IfWinActive
;---------------------------------------------------------------------

;----------------------------------------------------------------------
#IfWinActive Anki - User 1

XButton2::  ; در انکی سرپچ دیکشنری 
	clipboard = ; Empty the clipboard
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
#IfWinExist, Browser
   #y::
	clipboard = ; Empty the clipboard
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
sleep, 200 ;(wait 0.2 seconds) 
WinActivate, Browser ; use the window found above
send, ^{f}
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{v}{ctrl up}
sleep, 200 ;(wait 0.2 seconds)
send, {Enter}
Return

#IfWinActive
;------------------------------------------------------------------------
;--------------------------------------------------------kindle, mendeley
#If WinActive("hamid's Kindle for PC") or WinActive("Mendeley Desktop") or WinActive("WinEdt 10.1") or WinActive("ahk_id 0x640b00")
XButton2::
	clipboard = ; Empty the clipboard
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
Return

#IfWinActive
;--------------------------------------------------------------------------

;---------------------------------------------------------------------------
;--------------------------------------------------------search
#\::
sleep, 500 ;(wait 0.5 seconds) 

send, ^c
run, https://www.google.com/search?q=%clipboard%&newwindow=1&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiMzI7g5MHaAhWpIMAKHUXCCVsQ_AUICigB&biw=1677&bih=841
;run, C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
;send, {ctrl down}{v}{ctrl up}
Return
;--------------------------------------------------------------------------
#/::
	clipboard = ; Empty the clipboard
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
sleep, 500 ;(wait 0.5 seconds) 
run, http://www.mnemonicdictionary.com/?word=%clipboard%
;run, C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
;send, {ctrl down}{v}{ctrl up}
Return

;--------------------------------------------------------------------------------

#IfWinExist, Browser
#If WinActive("GoldenDict") or WinActive("ahk_exe GoldenDict.exe") or WinActive("ahk_id 0x4077c") or WinActive("ahk_id 0x640b00") or WinActive("ahk_id 0x503e6")
   XButton2::
	
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
WinActivate, Browser ; use the window found above
send, ^{f}
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{v}{ctrl up}
sleep, 200 ;(wait 0.2 seconds)
send, {Enter}
Return

;---------------------------------------------------------------------------------------

#IfWinActive
#IfWinActive GoldenDict ; MainGoldenDict
XButton2::
	
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
Return

#IfWinActive

#IfWinActive
#IfWinActive ahk_exe GoldenDict.exe ;GoldenDict
XButton2::
	
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
Return
#IfWinActive
;----------------------------------------------------------------------------------

#IfWinExist, Add ; Add of anki ; ادد
#If WinActive("ahk_exe GoldenDict.exe") or WinActive("GoldenDict") ;GoldenDict
  XButton1::
	clipboard = ; Empty the clipboard
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
run, https://www.google.com/search?q=%clipboard%&newwindow=1&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiMzI7g5MHaAhWpIMAKHUXCCVsQ_AUICigB&biw=1677&bih=841
WinActivate, Add ;use the window found above
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{v}{ctrl up}
sleep, 200 ;(wait 0.2 seconds)
send, {Tab} ;tab

Return

;---------------
#IfWinExist, Add ; Add of anki ; ادد
#If WinActive("ahk_exe GoldenDict.exe") or WinActive("GoldenDict") ;GoldenDict
 !Q::
clipboard = ; Empty the clipboard
Send, ^c
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
WinActivate, Add ;use the window found above
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{v}{ctrl up}
sleep, 100 ;(wait 0.2 seconds)
send, {Tab} ;tab
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{t}{ctrl up}
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{v}{ctrl up}	
sleep, 200 ;(wait 0.1 seconds)
send, {LButton}
sleep, 400 ;(wait 0.1 seconds)
send, {Tab} ;tab
Return

	MButton::
	clipboard = ; Empty the clipboard
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
WinActivate, Add ;use the window found above
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{v}{ctrl up}
sleep, 300 ;(wait 0.2 seconds)
Return

#IfWinExist, Add ; Add of anki ; ادد
{If WinActive("ahk_exe firefox.exe") or WinActive("Browser") ;firefox

	!MButton::
	clipboard = ; Empty the clipboard
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
WinActivate, Add ;use the window found above
sleep, 200 ;(wait 0.2 seconds)
send, {ctrl down}{v}{ctrl up}
sleep, 300 ;(wait 0.2 seconds)
Return
}

;-----------------------------------
#IfWinActive jetAudio

XButton2::
	
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
Return

#IfWinActive
;---------------------------------------
;----------
;LaTex
;----------
;---------------------------------------
#IfWinActive ahk_exe texstudio.exe ;TeXstudio ایجاد نیم فاصله ، shift+f1

SC056::
send, +{SC03B}
Return

XButton2::
	clipboard = ; Empty the clipboard
send, {ctrl down}{c}
sleep, 50 ;(wait 0.2 seconds)
send, {ctrl up}
ClipWait, 2
if ErrorLevel
{
    MsgBox, The attempt to copy text onto the clipboard failed.
    return
}
Return

:*:پقثب::~\ref{


#IfWinActive
;---------------------------------------------------------------
;--------------------------------------------------------------------

#IfWinActive ahk_exe CNEXT.exe

XButton2::
send, {rButton}{f}
Return

#IfWinActive

#IfWinActive ahk_exe CNEXT.exe

XButton1::
send, {rButton}{h}
Return

#IfWinActive



;ahk_id 0x640b00=SumatraPDF
;ahk_id 0x1c0f64=Add
;ahk_id 0xb0ca2=2ndgoldendict
;ahk_id 0x503e6=maingoldendict
;ahk_id 0xb1312=TeXstudio
;ahk_exe CNEXT.exe
