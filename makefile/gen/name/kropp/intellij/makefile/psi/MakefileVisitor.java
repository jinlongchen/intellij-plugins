// This is a generated file. Not intended for manual editing.
package name.kropp.intellij.makefile.psi;

import com.intellij.psi.PsiElement;
import com.intellij.psi.PsiElementVisitor;
import org.jetbrains.annotations.NotNull;

public class MakefileVisitor extends PsiElementVisitor {

  public void visitCommands(@NotNull MakefileCommands o) {
    visitPsiElement(o);
  }

  public void visitConditional(@NotNull MakefileConditional o) {
    visitPsiElement(o);
  }

  public void visitDefine(@NotNull MakefileDefine o) {
    visitPsiElement(o);
  }

  public void visitElsebranch(@NotNull MakefileElsebranch o) {
    visitPsiElement(o);
  }

  public void visitFilename(@NotNull MakefileFilename o) {
    visitPsiElement(o);
  }

  public void visitInclude(@NotNull MakefileInclude o) {
    visitPsiElement(o);
  }

  public void visitNormalPrerequisites(@NotNull MakefileNormalPrerequisites o) {
    visitPsiElement(o);
  }

  public void visitOrderOnlyPrerequisites(@NotNull MakefileOrderOnlyPrerequisites o) {
    visitPsiElement(o);
  }

  public void visitPrerequisite(@NotNull MakefilePrerequisite o) {
    visitPsiElement(o);
  }

  public void visitPrerequisites(@NotNull MakefilePrerequisites o) {
    visitPsiElement(o);
  }

  public void visitRecipe(@NotNull MakefileRecipe o) {
    visitPsiElement(o);
  }

  public void visitRule(@NotNull MakefileRule o) {
    visitPsiElement(o);
  }

  public void visitTarget(@NotNull MakefileTarget o) {
    visitNamedElement(o);
  }

  public void visitTargetLine(@NotNull MakefileTargetLine o) {
    visitPsiElement(o);
  }

  public void visitTargets(@NotNull MakefileTargets o) {
    visitPsiElement(o);
  }

  public void visitThenbranch(@NotNull MakefileThenbranch o) {
    visitPsiElement(o);
  }

  public void visitVariable(@NotNull MakefileVariable o) {
    visitPsiElement(o);
  }

  public void visitVariableName(@NotNull MakefileVariableName o) {
    visitPsiElement(o);
  }

  public void visitNamedElement(@NotNull MakefileNamedElement o) {
    visitPsiElement(o);
  }

  public void visitPsiElement(@NotNull PsiElement o) {
    visitElement(o);
  }

}