package com.intellij.dts.lang.psi

import com.intellij.psi.PsiElement

sealed interface DtsValue : PsiElement {

    interface Int : DtsValue {
        fun dtsParse(): kotlin.Int?
    }

    interface Untyped : DtsValue
}